require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3200;

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const cors = require('cors');

const db = require("./database.js");

const router = express.Router();

const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(router);
app.use(cookieParser());


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

        const token = jwt.sign(
            { id: foundUser.id, roles: roleList },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: foundUser.id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        try {
            const connection = await db.getConnection();
            const [roles] = await connection.query(
                'select r.name from user_roles ur join roles r on ur.role_id = r.id where ur.user_id = ?',
                [decoded.id]
            );
            connection.release();

            const roleList = roles.map(r => r.name);

            const newAccessToken = jwt.sign(
                { id: decoded.id, roles: roleList },
                process.env.ACCESS_SECRET,
                { expiresIn: "1d" }
            );

            res.json({ token: newAccessToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
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

        const { title, description, price } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        const [result] = await connection.query(
            "insert into courses (title, description, price) values (?, ?, ?)",
            [title, description, price]
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
        console.log(rows)

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

        console.log(req.body);
        console.log("User id:", req.user.id);

        await connection.beginTransaction();

        const [pointsRows] = await connection.query(
            "select points from users where id = ?",
            [req.user.id]
        );

        const [courseRows] = await connection.query(
            "select * from courses where id = ?",
            [req.params.id]
        );

        if (courseRows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        const course = courseRows[0];

        if (pointsRows[0].points < course.price) {
            return res.status(400).json({ message: "Not enough points" });
        }

        await connection.query(
            "update users set points = points - ? where id = ?",
            [course.price, req.user.id]
        );

        const [insertResult] = await connection.query(
            "insert into course_instances (template_id, owner_id, title, description) values (?, ?, ?, ?)",
            [req.params.id, req.user.id, course.title, course.description]
        );

        await connection.commit();

        res.status(201).json({
            message: "Course purchased",
            courseId: insertResult.insertId
        });

    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

app.get('/courses/:id/owner', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "select * from course_instances where owner_id = ? and template_id = ?",
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
        const { title, description, price } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        if (!description) {
            return res.status(400).json({ message: "Description required" });
        }

        if (!price || price < 0) {
            return res.status(400).json({ message: "Price must be positive" });
        }

        const [result] = await connection.query(
            "update courses set title = ?, description = ?, price = ? where id = ?",
            [title, description, price, id]
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

// delete course
app.delete("/courses/:id", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        const [result] = await connection.query(
            "delete from courses where id = ?",
            [id]
        );

        await connection.commit();

        res.status(200).json({
            message: "Course deleted",
            courseId: id
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    }
});

// get all users
app.get("/admin/users", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const [rows] = await db.query("select id, username, points from users");

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// add points
app.post("/admin/users/:id/add-points", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { points } = req.body;

        if (!points || points < 0) {
            return res.status(400).json({ message: "Points must be positive" });
        }

        const [result] = await connection.query(
            "update users set points = points + ? where id = ?",
            [points, id]
        );

        await connection.commit();

        res.status(200).json({
            message: "Points added",
            userId: id
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
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
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



