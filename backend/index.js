require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3200;

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const cors = require('cors');

const db = require("./database.js");

const router = express.Router();

app.use(express.json());
app.use(cors());
app.use(router);


app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

router.post('/login', async (req, res) => {
    try {
        const connection = await db.getConnection();

        const { user, password } = req.body;

        const [users] = await connection.query(
            'select * from users where username = ? or email = ?',
            [user, user]
        );

        if (users.length === 0) {
            return res.status(404).json('User not found');
        }

        const foundUser = users[0];

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res.status(401).json('Invalid password');
        }

        const [roles] = await connection.query(
            'select r.name from user_roles ur join roles r on ur.role_id = r.id where ur.user_id = ?',
            [foundUser.id]
        );

        connection.release();

        const roleList = roles.map(r => r.name);

        const token = jwt.sign({
            id: foundUser.id,
            roles: roleList
        }, 'secretkey', { expiresIn: "1h" });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/register', async (req, res) => {
    const connection = await db.getConnection();

    try {
        console.log(req.body)
        const { username, name, email, password } = req.body;



        if (!email || !password || !username || !name) {
            return res.status(400).json({ message: "All fields required" });
        }

        await connection.beginTransaction();

        const [existingUser] = await connection.query(
            'select id from users where username = ? or email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: "Username already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const [userResult] = await connection.query(
            `insert into users 
            (username, name, email, password, points) 
            values (?, ?, ?, ?, ?)`,
            [username, name, email, hashedPassword, 0]
        );

        const userId = userResult.insertId;


        const [roleRows] = await connection.query(
            "select id from roles where name = 'student'"
        );


        if (!roleRows.length) {
            await connection.rollback();
            return res.status(400).json({ message: "Invalid role" });
        }

        const roleId = roleRows[0].id;


        await connection.query(
            'insert into user_roles (user_id, role_id) values (?, ?)',
            [userId, roleId]
        );


        await connection.commit();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// create course
app.post("/courses", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        const [result] = await connection.query(
            "insert into courses (title, description, owner_id) values (?, ?, ?)",
            [title, description, req.user.id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Course created",
            courseId: result.insertId
        });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
}
);

// get all course
app.get("/courses", async (req, res) => {
    try {
        const [rows] = await db.query(`
            select * from courses order by created_at desc limit 10
        `);

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get course (id)
app.get("/courses/:id", async (req, res) => {
    const [rows] = await db.query(
        "select * from courses where id = ?",
        [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
});

// buy course
app.post("/courses/:id/buy", verifyToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [points] = await db.query(
            "select points from users where id = ?",
            [req.user.id]
        );

        const [price] = await db.query(
            "select price from courses where id = ?",
            [req.params.id]
        );

        if (points[0].points < price[0].price) {
            return res.status(400).json({ message: "Not enough points" });
        }

        const [result] = await connection.query(
            "insert into owner_courses (user_id, course_id) values (?, ?)",
            [req.user.id, req.params.id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Course purchased",
            courseId: req.params.id
        });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

app.get('/courses/:id/owner', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "select * from owner_courses where user_id = ? and course_id = ?",
            [req.user.id, req.params.id]
        );

        res.json(rows.length > 0);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// edit course
app.put("/courses/:id/edit", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        const [result] = await connection.query(
            "update courses set title = ?, description = ? where id = ?",
            [title, description, id]
        );

        await connection.commit();

        res.status(200).json({
            message: "Course updated",
            courseId: id
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    }
});

// middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(403);

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
}

function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user.roles.includes(requiredRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

// log check connection

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to Database');

        connection.release();
    } catch (err) {
        console.error("DB Connection Failed:", err.message);
    }
})();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



