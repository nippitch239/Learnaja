require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3200;
const path = require("path");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const cors = require('cors');

const db = require("./database.js");

const router = express.Router();

const cookieParser = require("cookie-parser");

const multer = require("multer");

const { v4: uuidv4 } = require("uuid");


const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost,http://localhost:5173")
    .split(",")
    .map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

router.get('/', (req, res) => {
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
            { id: foundUser.id, roles: roleList, name: foundUser.username, image_profile: foundUser.image_profile, point: foundUser.points },
            process.env.ACCESS_SECRET,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { id: foundUser.id, roles: roleList, name: foundUser.username, image_profile: foundUser.image_profile, point: foundUser.points },
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

router.post("/refresh", (req, res) => {
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
                { id: decoded.id, roles: roleList, name: decoded.name, image_profile: decoded.image_profile, point: decoded.point },
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

        console.log("finish")

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log("failed")
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// create course
router.post("/courses", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { title, description, price, category, rating, rating_count, thumbnail_url } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        const [result] = await connection.query(
            "insert into courses (title, description, price, category, rating, rating_count, thumbnail_url) values (?, ?, ?, ?, ?, ?, ?)",
            [title, description, price, category, rating || 0, rating_count || 0, thumbnail_url || null]
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
router.get("/courses", async (req, res) => {
    try {
        const { search, sortBy, limit } = req.query;
        let query = "select * from courses";
        let params = [];

        if (search) {
            query += " where title like ? or category like ?";
            params.push(`%${search}%`, `%${search}%`);
        }

        if (sortBy === 'popular') {
            query += " order by (select count(*) from course_instances where template_id = courses.id) desc";
        } else if (sortBy === 'rating_desc') {
            query += " order by rating desc";
        } else if (sortBy === 'rating_asc') {
            query += " order by rating asc";
        } else if (sortBy === 'price_desc') {
            query += " order by price desc";
        } else if (sortBy === 'price_asc') {
            query += " order by price asc";
        } else if (sortBy === 'rating') { // backward compatibility
            query += " order by rating desc";
        } else {
            query += " order by created_at desc";
        }

        if (limit) {
            query += " limit ?";
            params.push(parseInt(limit));
        } else {
            query += " limit 20";
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get course (owner)
router.get('/courses/owner', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            `select ci.*, coalesce(ci.thumbnail_url, c.thumbnail_url) as thumbnail_url
             from course_instances ci
             join courses c on ci.template_id = c.id
             where ci.owner_id = ?`,
            [req.user.id]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get course (invited)
router.get('/courses/invited', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            `select ci.*, coalesce(ci.thumbnail_url, c.thumbnail_url) as thumbnail_url 
            from instance_students ist
            join course_instances ci on ist.instance_id = ci.id
            join courses c on ci.template_id = c.id
            where ist.user_id = ?`,
            [req.user.id]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get course (id)
router.get("/courses/:id", async (req, res) => {
    const [rows] = await db.query(
        "select * from courses where id = ?",
        [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
});

// get full course content (id)
router.get("/courses/:id/full", async (req, res) => {
    try {
        const { id } = req.params;

        const [courseRows] = await db.query("select * from courses where id = ?", [id]);
        if (courseRows.length === 0) return res.status(404).json({ message: "Course not found" });
        const course = courseRows[0];

        const [modules] = await db.query("select * from course_modules where course_id = ? order by order_index", [id]);

        for (let module of modules) {
            const [lessons] = await db.query("select * from course_lessons where module_id = ? order by order_index", [module.id]);
            module.lessons = lessons;

            const [quizzes] = await db.query("select * from course_quizzes where module_id = ?", [module.id]);
            for (let quiz of quizzes) {
                const [questions] = await db.query("select * from course_quiz_questions where quiz_id = ?", [quiz.id]);
                quiz.questions = questions;
            }
            module.quizzes = quizzes;

            const [assignments] = await db.query("select * from course_assignments where module_id = ?", [module.id]);
            module.assignments = assignments;
        }

        course.modules = modules;
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get instance 
router.get("/instances/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [ownerRows] = await db.query(
            "select * from course_instances where id = ? and owner_id = ?",
            [id, userId]
        );

        if (ownerRows.length > 0) {
            return res.json({ ...ownerRows[0], role: 'owner' });
        }

        const [studentRows] = await db.query(
            `select ci.* 
             from instance_students ist
             join course_instances ci on ist.instance_id = ci.id
             where ci.id = ? and ist.user_id = ?`,
            [id, userId]
        );

        if (studentRows.length > 0) {
            return res.json({ ...studentRows[0], role: 'student' });
        }

        res.status(403).json({ message: "Access denied to this instance" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get full instance content (custom modules or template modules)
router.get("/instances/:id/full", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // 1. Check if allowed to view (owner or student)
        const [instanceRows] = await db.query(
            `select ci.*, coalesce(ci.thumbnail_url, c.thumbnail_url) as thumbnail_url, c.category, c.price as original_price
             from course_instances ci
             join courses c on ci.template_id = c.id
             where ci.id = ?`,
            [id]
        );
        if (instanceRows.length === 0) return res.status(404).json({ message: "Instance not found" });
        const instance = instanceRows[0];

        const [studentRows] = await db.query(
            "select * from instance_students where instance_id = ? and user_id = ?",
            [id, userId]
        );
        if (instance.owner_id !== userId && studentRows.length === 0 && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: "Access denied" });
        }

        let [instanceModules] = await db.query(
            "select * from course_modules where instance_id = ? order by order_index",
            [id]
        );

        let [templateModules] = await db.query(
            "select * from course_modules where course_id = ? order by order_index",
            [instance.template_id]
        );

        const overriddenTemplateIds = instanceModules
            .filter(m => m.template_module_id !== null)
            .map(m => m.template_module_id);

        const newTemplateModules = templateModules.filter(m => !overriddenTemplateIds.includes(m.id));

        let modules = [...instanceModules, ...newTemplateModules].sort((a, b) => a.order_index - b.order_index);

        for (let module of modules) {
            const [lessons] = await db.query("select * from course_lessons where module_id = ? order by order_index", [module.id]);
            module.lessons = lessons;

            const [quizzes] = await db.query("select * from course_quizzes where module_id = ? order by order_index", [module.id]);
            for (let quiz of quizzes) {
                const [questions] = await db.query("select * from course_quiz_questions where quiz_id = ?", [quiz.id]);
                quiz.questions = questions;
            }
            module.quizzes = quizzes;

            const [assignments] = await db.query("select * from course_assignments where module_id = ? order by order_index", [module.id]);
            module.assignments = assignments;
        }

        instance.modules = modules;
        res.json(instance);
    } catch (err) {
        console.error("DEBUG: /instances/:id/full error ->", err);
        res.status(500).json({ error: err.message });
    }
});

// buy course
router.post("/courses/:id/buy", verifyToken, async (req, res) => {
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



// edit course
router.put("/courses/:id/edit", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { title, description, price, thumbnail_url, category, rating, rating_count } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        if (!description) {
            return res.status(400).json({ message: "Description required" });
        }

        if (price < 0) {
            return res.status(400).json({ message: "Price must be positive" });
        }

        const [result] = await connection.query(
            "update courses set title = ?, description = ?, price = ?, thumbnail_url = ?, category = ?, rating = ?, rating_count = ? where id = ?",
            [title, description, price, thumbnail_url, category, rating || 0, rating_count || 0, id]
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

// edit instance info
router.put("/instances/:id/edit", verifyToken, verifyInstanceOwner, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { title, description, thumbnail_url } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        if (!description) {
            return res.status(400).json({ message: "Description required" });
        }

        const [result] = await connection.query(
            "update course_instances set title = ?, description = ?, thumbnail_url = ? where id = ?",
            [title, description, thumbnail_url, id]
        );

        await connection.commit();

        res.status(200).json({
            message: "Instance updated",
            instanceId: id
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// delete course
router.delete("/courses/:id", verifyToken, checkRole("admin"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        const [instances] = await connection.query("SELECT id FROM course_instances WHERE template_id = ?", [id]);
        const instanceIds = instances.map(i => i.id);

        if (instanceIds.length > 0) {
            const inPlaceholders = instanceIds.map(() => '?').join(',');
            const [enrolledStudents] = await connection.query(
                `SELECT COUNT(*) as count FROM instance_students WHERE instance_id IN (${inPlaceholders})`,
                instanceIds
            );
            if (enrolledStudents[0].count > 0) {
                await connection.rollback();
                return res.status(409).json({
                    message: `ไม่สามารถลบคอร์สได้ เนื่องจากมีนักเรียน ${enrolledStudents[0].count} คนลงทะเบียนอยู่`,
                    enrolled_count: enrolledStudents[0].count
                });
            }

            await connection.query(`DELETE FROM course_progress WHERE instance_id IN (${inPlaceholders})`, instanceIds);
            await connection.query(`DELETE FROM course_quiz_results WHERE instance_id IN (${inPlaceholders})`, instanceIds);
            await connection.query(`DELETE FROM course_instances WHERE id IN (${inPlaceholders})`, instanceIds);
        }

        await connection.query("DELETE FROM course_ratings WHERE course_id = ?", [id]);

        await connection.query("DELETE FROM courses WHERE id = ?", [id]);

        await connection.commit();

        res.status(200).json({
            message: "Course deleted successfully",
            courseId: id
        });
    } catch (err) {
        await connection.rollback();
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete course: " + err.message });
    } finally {
        connection.release();
    }
});


// get all users
router.get("/users", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query("select id, username, points from users");

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// add points
router.post("/admin/users/:id/add-points", verifyToken, checkRole("admin"), async (req, res) => {
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

//instaces course (duplicated)
router.get("/courses/:id/instances", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "select * from course_instances where template_id = ? and owner_id = ?",
            [req.params.id, req.user.id]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get users for select
router.get("/users/search", verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const [rows] = await db.query(
            "select id, username, email from users where username like ? and id != ?",
            [`%${q}%`, req.user.id]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// invite student to instance
router.post("/instances/:id/invite", verifyToken, checkRole("teacher"), async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID required" });
        }

        const [course] = await connection.query(
            "select * from course_instances where id = ? and owner_id = ?",
            [id, req.user.id]
        );

        if (course.length === 0) {
            return res.status(404).json({ message: "Course instance not found" });
        }

        const instanceId = course[0].id;

        const [result2] = await connection.query(
            "select * from instance_students where instance_id = ? and user_id = ?",
            [instanceId, studentId]
        );

        if (result2.length > 0) {
            return res.status(400).json({ message: "Error: Student already invited" });
        }

        const [result] = await connection.query(
            "insert into instance_students (instance_id, user_id) values (?, ?)",
            [instanceId, studentId]
        );



        await connection.commit();

        res.status(201).json({
            message: "Student invited",
            courseId: result.insertId
        });
    } catch (err) {
        console.log(err.message)
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// delete instance course (and its invited students and progress)
router.delete("/instances/:id", verifyToken, verifyInstanceOwner, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        // remove invited students
        await connection.query(
            "delete from instance_students where instance_id = ?",
            [id]
        );

        // remove progress and quiz results
        await connection.query(
            "delete from course_progress where instance_id = ?",
            [id]
        );
        await connection.query(
            "delete from course_quiz_results where instance_id = ?",
            [id]
        );

        // remove the instance itself
        const [result] = await connection.query(
            "delete from course_instances where id = ?",
            [id]
        );

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Instance not found" });
        }

        res.status(200).json({ message: "Instance deleted successfully" });
    } catch (err) {
        await connection.rollback();
        console.error("Delete instance error:", err);
        res.status(500).json({ error: "Failed to delete instance: " + err.message });
    } finally {
        connection.release();
    }
});

router.get('/instances/:id/students', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [course] = await db.query(
            "select id from course_instances where id = ? and owner_id = ?",
            [id, req.user.id]
        );

        if (course.length === 0) return res.status(404).json({ message: "Not found" });

        const instanceId = course[0].id;

        const [rows] = await db.query(
            `select u.id, u.username, u.name, u.email
            from instance_students ist
            join users u on ist.user_id = u.id
            where ist.instance_id = ?`,
            [instanceId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// delete invite
router.delete('/instances/:id/invite', verifyToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        await connection.beginTransaction();
        if (!studentId) {
            return res.status(400).json({ message: "Student ID required" });
        }

        const [course] = await connection.query(
            "select id from course_instances where id = ? and owner_id = ?",
            [id, req.user.id]
        );

        if (course.length === 0) {
            return res.status(404).json({ message: "Course instance not found" });
        }

        const instanceId = course[0].id;

        await connection.query(
            "delete from instance_students where instance_id = ? and user_id = ?",
            [instanceId, studentId]
        );

        await connection.commit();
        res.status(200).json({
            message: "Student removed",
            courseId: id
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
})

// --- Instance Customization (Clone to Instance) ---
router.post("/instances/:id/customize", verifyToken, verifyInstanceOwner, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const instanceId = req.params.id;

        const [instances] = await connection.query("select * from course_instances where id = ?", [instanceId]);
        const instance = instances[0];
        const templateId = instance.template_id;

        const [existing] = await connection.query("select id from course_modules where instance_id = ?", [instanceId]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Instance already customized" });
        }

        const [modules] = await connection.query("select * from course_modules where course_id = ? order by order_index", [templateId]);

        for (let mod of modules) {
            const [modRes] = await connection.query(
                "insert into course_modules (instance_id, title, order_index, template_module_id) values (?, ?, ?, ?)",
                [instanceId, mod.title, mod.order_index, mod.id]
            );
            const newModId = modRes.insertId;

            const [lessons] = await connection.query("select * from course_lessons where module_id = ? order by order_index", [mod.id]);
            for (let less of lessons) {
                await connection.query(
                    "insert into course_lessons (module_id, title, type, duration_minutes, content, order_index) values (?, ?, ?, ?, ?, ?)",
                    [newModId, less.title, less.type, less.duration_minutes, JSON.stringify(less.content), less.order_index]
                );
            }

            const [quizzes] = await connection.query("select * from course_quizzes where module_id = ? order by order_index", [mod.id]);
            for (let quiz of quizzes) {
                const [quizRes] = await connection.query(
                    "insert into course_quizzes (module_id, title, passing_score, order_index) values (?, ?, ?, ?)",
                    [newModId, quiz.title, quiz.passing_score, quiz.order_index || 0]
                );
                const newQuizId = quizRes.insertId;

                const [questions] = await connection.query("select * from course_quiz_questions where quiz_id = ?", [quiz.id]);
                for (let q of questions) {
                    await connection.query(
                        "insert into course_quiz_questions (quiz_id, question, type, choices, correct_answer, points) values (?, ?, ?, ?, ?, ?)",
                        [newQuizId, q.question, q.type, JSON.stringify(q.choices), q.correct_answer, q.points]
                    );
                }
            }

            const [assignments] = await connection.query("select * from course_assignments where module_id = ? order by order_index", [mod.id]);
            for (let ass of assignments) {
                await connection.query(
                    "insert into course_assignments (module_id, title, description, max_score, submission_type, order_index) values (?, ?, ?, ?, ?, ?)",
                    [newModId, ass.title, ass.description, ass.max_score, ass.submission_type, ass.order_index || 0]
                );
            }
        }

        await connection.commit();
        res.json({ message: "Instance customized successfully" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// --- Content Management (Admin Only) ---

// Add Module
router.post("/courses/:id/modules", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, order_index } = req.body;
        const [result] = await db.query(
            "insert into course_modules (course_id, title, order_index) values (?, ?, ?)",
            [id, title, order_index || 0]
        );
        res.status(201).json({ message: "Module added", moduleId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Module to Instance
router.post("/instances/:id/modules", verifyToken, verifyInstanceOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, order_index } = req.body;
        const [result] = await db.query(
            "insert into course_modules (instance_id, title, order_index) values (?, ?, ?)",
            [id, title, order_index || 0]
        );
        res.status(201).json({ message: "Module added", moduleId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Lesson
router.post("/modules/:id/lessons", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, duration_minutes, content, order_index } = req.body;
        const [result] = await db.query(
            "insert into course_lessons (module_id, title, type, duration_minutes, content, order_index) values (?, ?, ?, ?, ?, ?)",
            [id, title, type, duration_minutes || 0, JSON.stringify(content), order_index || 0]
        );
        res.status(201).json({ message: "Lesson added", lessonId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Quiz
router.post("/modules/:id/quizzes", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, passing_score, order_index } = req.body;
        const [result] = await db.query(
            "insert into course_quizzes (module_id, title, passing_score, order_index) values (?, ?, ?, ?)",
            [id, title, passing_score || 70, order_index || 0]
        );
        res.status(201).json({ message: "Quiz added", quizId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Question to Quiz
router.post("/quizzes/:id/questions", verifyToken, verifyQuizAccess, async (req, res) => {
    try {
        const { id } = req.params;
        const { question, type, choices, correct_answer, points } = req.body;
        const [result] = await db.query(
            "insert into course_quiz_questions (quiz_id, question, type, choices, correct_answer, points) values (?, ?, ?, ?, ?, ?)",
            [id, question, type || 'multiple_choice', JSON.stringify(choices), correct_answer, points || 10]
        );
        res.status(201).json({ message: "Question added", questionId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Assignment
router.post("/modules/:id/assignments", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, max_score, submission_type, order_index } = req.body;
        const [result] = await db.query(
            "insert into course_assignments (module_id, title, description, max_score, submission_type, order_index) values (?, ?, ?, ?, ?, ?)",
            [id, title, description, max_score || 100, submission_type || 'file_upload', order_index || 0]
        );
        res.status(201).json({ message: "Assignment added", assignmentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Module
router.delete("/modules/:id", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        await db.query("delete from course_modules where id = ?", [req.params.id]);
        res.json({ message: "Module deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Lesson
router.delete("/lessons/:id", verifyToken, verifyLessonAccess, async (req, res) => {
    try {
        await db.query("delete from course_lessons where id = ?", [req.params.id]);
        res.json({ message: "Lesson deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Quiz
router.delete("/quizzes/:id", verifyToken, verifyQuizAccess, async (req, res) => {
    try {
        await db.query("delete from course_quizzes where id = ?", [req.params.id]);
        res.json({ message: "Quiz deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Assignment
router.delete("/assignments/:id", verifyToken, verifyAssignmentAccess, async (req, res) => {
    try {
        await db.query("delete from course_assignments where id = ?", [req.params.id]);
        res.json({ message: "Assignment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Question
router.delete("/questions/:id", verifyToken, verifyQuestionAccess, async (req, res) => {
    try {
        await db.query("delete from course_quiz_questions where id = ?", [req.params.id]);
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Question
router.put("/questions/:id", verifyToken, verifyQuestionAccess, async (req, res) => {
    try {
        const { question, type, choices, correct_answer, points } = req.body;
        await db.query(
            "update course_quiz_questions set question = ?, type = ?, choices = ?, correct_answer = ?, points = ? where id = ?",
            [question, type || 'single_choice', JSON.stringify(choices), correct_answer, points || 10, req.params.id]
        );
        res.json({ message: "Question updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reorder Modules in Instance
router.post("/instances/:id/modules/reorder", verifyToken, verifyInstanceOwner, async (req, res) => {
    try {
        const { order } = req.body; // array of module IDs in new order
        if (!Array.isArray(order)) return res.status(400).json({ message: "order must be an array" });
        for (let i = 0; i < order.length; i++) {
            await db.query("update course_modules set order_index = ? where id = ?", [i + 1, order[i]]);
        }
        res.json({ message: "Modules reordered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reorder Modules in Course
router.post("/courses/:id/modules/reorder", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) return res.status(400).json({ message: "order must be an array" });
        for (let i = 0; i < order.length; i++) {
            await db.query("update course_modules set order_index = ? where id = ?", [i + 1, order[i]]);
        }
        res.json({ message: "Modules reordered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reorder Items within a Module
router.post("/modules/:id/items/reorder", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) return res.status(400).json({ message: "order must be an array" });

        for (let i = 0; i < order.length; i++) {
            const item = order[i];
            let table = "";
            if (item.type === 'lesson') table = "course_lessons";
            else if (item.type === 'quiz') table = "course_quizzes";
            else if (item.type === 'assignment') table = "course_assignments";

            if (table) {
                await db.query(`update ${table} set order_index = ? where id = ?`, [i + 1, item.id]);
            }
        }
        res.json({ message: "Items reordered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Module
router.put("/modules/:id", verifyToken, verifyModuleAccess, async (req, res) => {
    try {
        const { title } = req.body;
        await db.query("update course_modules set title = ? where id = ?", [title, req.params.id]);
        res.json({ message: "Module updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Lesson
router.put("/lessons/:id", verifyToken, verifyLessonAccess, async (req, res) => {
    try {
        const { title, duration_minutes, content } = req.body;
        await db.query(
            "update course_lessons set title = ?, duration_minutes = ?, content = ? where id = ?",
            [title, duration_minutes || 0, JSON.stringify(content), req.params.id]
        );
        res.json({ message: "Lesson updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Quiz
router.put("/quizzes/:id", verifyToken, verifyQuizAccess, async (req, res) => {
    try {
        const { title, passing_score } = req.body;
        await db.query("update course_quizzes set title = ?, passing_score = ? where id = ?", [title, passing_score || 0, req.params.id]);
        res.json({ message: "Quiz updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Assignment
router.put("/assignments/:id", verifyToken, verifyAssignmentAccess, async (req, res) => {
    try {
        const { title, description } = req.body;
        await db.query("update course_assignments set title = ?, description = ? where id = ?", [title, description, req.params.id]);
        res.json({ message: "Assignment updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Course Ratings ---

// Rate a course
router.post("/courses/:id/rate", verifyToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const courseId = req.params.id;
        const userId = req.user.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating" });
        }

        const [instances] = await connection.query(
            `select ci.id 
             from course_instances ci
             left join instance_students ist on ci.id = ist.instance_id
             where ci.template_id = ? and (ci.owner_id = ? or ist.user_id = ?)`,
            [courseId, userId, userId]
        );

        if (instances.length === 0) {
            return res.status(403).json({ message: "You must be enrolled in this course to rate it" });
        }

        const instanceId = instances[0].id;

        const [modules] = await connection.query(
            "select id from course_modules where course_id = ? or instance_id = ?",
            [courseId, instanceId]
        );
        const moduleIds = modules.map(m => m.id);

        let totalItems = 0;
        if (moduleIds.length > 0) {
            const inPlaceholders = moduleIds.map(() => '?').join(',');
            const [lessons] = await connection.query(`select count(*) as count from course_lessons where module_id in (${inPlaceholders})`, moduleIds);
            const [quizzes] = await connection.query(`select count(*) as count from course_quizzes where module_id in (${inPlaceholders})`, moduleIds);
            const [assignments] = await connection.query(`select count(*) as count from course_assignments where module_id in (${inPlaceholders})`, moduleIds);
            totalItems = lessons[0].count + quizzes[0].count + assignments[0].count;
        }

        const [progressRows] = await connection.query(
            "select count(*) as count from course_progress where user_id = ? and instance_id = ?",
            [userId, instanceId]
        );
        const [quizRows] = await connection.query(
            "select count(*) as count from course_quiz_results where user_id = ? and instance_id = ? and passed = 1",
            [userId, instanceId]
        );

        const completedItems = progressRows[0].count + quizRows[0].count;

        if (totalItems > 0 && completedItems < totalItems) {
            return res.status(403).json({ message: "Please finish the course content before rating" });
        }

        await connection.query(
            "INSERT OR REPLACE INTO course_ratings (course_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
            [courseId, userId, rating, comment || ""]
        );

        const [stats] = await connection.query(
            "SELECT AVG(rating) as avg_r, COUNT(*) as count_r FROM course_ratings WHERE course_id = ?",
            [courseId]
        );

        await connection.query(
            "UPDATE courses SET rating = ?, rating_count = ? WHERE id = ?",
            [stats[0].avg_r || 0, stats[0].count_r || 0, courseId]
        );

        await connection.commit();
        res.json({ message: "Rating submitted successfully", averageRating: stats[0].avg_r });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Get user's rating for a specific course
router.get("/courses/:id/my-rating", verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT rating, comment FROM course_ratings WHERE course_id = ? AND user_id = ?",
            [req.params.id, req.user.id]
        );
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all ratings for a course
router.get("/courses/:id/ratings", async (req, res) => {
    try {
        const [rows] = await db.query(
            `select cr.*, u.name, u.username, u.image_profile 
             from course_ratings cr
             join users u on cr.user_id = u.id
             where cr.course_id = ?
             order by cr.rating desc`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Progress Tracking ---

// Save Lesson/Assignment Progress
router.post("/instances/:id/progress", verifyToken, async (req, res) => {
    try {
        const { id: instanceId } = req.params;
        const { content_type, content_id } = req.body;
        const userId = req.user.id;

        await db.query(
            "INSERT OR IGNORE INTO course_progress (user_id, instance_id, content_type, content_id) VALUES (?, ?, ?, ?)",
            [userId, instanceId, content_type, content_id]
        );
        await db.query(
            "UPDATE course_progress SET completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND instance_id = ? AND content_type = ? AND content_id = ?",
            [userId, instanceId, content_type, content_id]
        );

        res.json({ message: "Progress saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save Quiz Result
router.post("/instances/:id/quiz-result", verifyToken, async (req, res) => {
    try {
        const { id: instanceId } = req.params;
        const { quiz_id, score, passed } = req.body;
        const userId = req.user.id;

        // SQLite: upsert
        await db.query(
            "INSERT OR IGNORE INTO course_quiz_results (user_id, instance_id, quiz_id, score, passed) VALUES (?, ?, ?, ?, ?)",
            [userId, instanceId, quiz_id, score, passed]
        );
        await db.query(
            "UPDATE course_quiz_results SET score = ?, passed = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND instance_id = ? AND quiz_id = ?",
            [score, passed, userId, instanceId, quiz_id]
        );

        res.json({ message: "Quiz result saved" });
    } catch (err) {
        console.error("DEBUG: /instances/:id/quiz-result error ->", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Instance Progress
router.get("/instances/:id/progress", verifyToken, async (req, res) => {
    try {
        const { id: instanceId } = req.params;
        const userId = req.user.id;

        const [progressRows] = await db.query(
            "SELECT DISTINCT content_type, content_id FROM course_progress WHERE user_id = ? AND instance_id = ?",
            [userId, instanceId]
        );

        const [quizRows] = await db.query(
            "SELECT DISTINCT quiz_id, score, passed FROM course_quiz_results WHERE user_id = ? AND instance_id = ?",
            [userId, instanceId]
        );

        res.json({
            lessons: progressRows.filter(r => r.content_type === 'lesson').map(r => r.content_id),
            assignments: progressRows.filter(r => r.content_type === 'assignment').map(r => r.content_id),
            quizzes: quizRows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all students' progress for an instance (owner/admin only)
router.get("/instances/:id/students-progress", verifyToken, verifyInstanceOwner, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id: instanceId } = req.params;

        // Get template id for this instance
        const [instanceRows] = await connection.query(
            "select template_id from course_instances where id = ?",
            [instanceId]
        );
        if (instanceRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Instance not found" });
        }
        const templateId = instanceRows[0].template_id;

        // All modules (template or customized)
        const [modules] = await connection.query(
            "select id from course_modules where course_id = ? or instance_id = ?",
            [templateId, instanceId]
        );
        const moduleIds = modules.map(m => m.id);
        const totalModules = modules.length;

        // Map content ids by module
        const lessonsByModule = {};
        const quizzesByModule = {};
        const assignmentsByModule = {};

        if (moduleIds.length > 0) {
            const inPlaceholders = moduleIds.map(() => '?').join(',');

            const [lessonRows] = await connection.query(
                `select id, module_id from course_lessons where module_id in (${inPlaceholders})`,
                moduleIds
            );
            const [quizRowsAll] = await connection.query(
                `select id, module_id from course_quizzes where module_id in (${inPlaceholders})`,
                moduleIds
            );
            const [assignmentRows] = await connection.query(
                `select id, module_id from course_assignments where module_id in (${inPlaceholders})`,
                moduleIds
            );

            for (const r of lessonRows) {
                if (!lessonsByModule[r.module_id]) lessonsByModule[r.module_id] = [];
                lessonsByModule[r.module_id].push(r.id);
            }
            for (const r of quizRowsAll) {
                if (!quizzesByModule[r.module_id]) quizzesByModule[r.module_id] = [];
                quizzesByModule[r.module_id].push(r.id);
            }
            for (const r of assignmentRows) {
                if (!assignmentsByModule[r.module_id]) assignmentsByModule[r.module_id] = [];
                assignmentsByModule[r.module_id].push(r.id);
            }
        }

        // Get invited students only (do not include teacher/owner)
        const [invitedRows] = await connection.query(
            `select u.id, u.username, u.name, u.email 
             from instance_students ist 
             join users u on ist.user_id = u.id
             where ist.instance_id = ?`,
            [instanceId]
        );

        const seen = new Set();
        const students = [];

        for (const row of invitedRows) {
            if (seen.has(row.id)) continue;
            seen.add(row.id);

            const [progressRows] = await connection.query(
                "select content_type, content_id from course_progress where user_id = ? and instance_id = ?",
                [row.id, instanceId]
            );
            const [quizCount] = await connection.query(
                "select quiz_id, passed from course_quiz_results where user_id = ? and instance_id = ?",
                [row.id, instanceId]
            );

            const lessonsDone = new Set(
                progressRows.filter(r => r.content_type === 'lesson').map(r => Number(r.content_id))
            );
            const assignmentsDone = new Set(
                progressRows.filter(r => r.content_type === 'assignment').map(r => Number(r.content_id))
            );
            const quizResults = quizCount;

            let completedModules = 0;
            for (const m of modules) {
                const lIds = lessonsByModule[m.id] || [];
                const qIds = quizzesByModule[m.id] || [];
                const aIds = assignmentsByModule[m.id] || [];

                if (lIds.length === 0 && qIds.length === 0 && aIds.length === 0) continue;

                const allLessonsDone = lIds.every(id => lessonsDone.has(Number(id)));
                const allAssignmentsDone = aIds.every(id => assignmentsDone.has(Number(id)));
                const allQuizzesDone = qIds.every(id =>
                    quizResults.some(q => q.quiz_id === id && (q.passed == 1 || q.passed === true))
                );

                if (allLessonsDone && allAssignmentsDone && allQuizzesDone) {
                    completedModules++;
                }
            }

            const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

            students.push({
                id: row.id,
                username: row.username,
                name: row.name,
                email: row.email,
                completed_modules: completedModules,
                total_modules: totalModules,
                progress_percent: percent
            });
        }

        await connection.commit();
        res.json(students);
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// --- Profile Management ---

// GET user profile and stats
router.get("/profile/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [userRows] = await db.query(
            "select id, username, name, email, points, image_profile from users where id = ?",
            [userId]
        );
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = userRows[0];

        const [ownedInstances] = await db.query("select count(*) as count from course_instances where owner_id = ?", [userId]);
        const [invitedInstances] = await db.query("select count(*) as count from instance_students where user_id = ?", [userId]);

        const [progressCount] = await db.query("select count(*) as count from course_progress where user_id = ? and content_type = 'lesson'", [userId]);

        res.json({
            ...user,
            stats: {
                points: user.points || 0,
                learning: ownedInstances[0].count + invitedInstances[0].count,
                completed: Math.floor(progressCount[0].count / 5)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/profile/update", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        await db.query("update users set name = ? where id = ?", [name, userId]);
        res.json({ message: "Profile updated success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change password
router.put("/profile/password", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        const [userRows] = await db.query("select password from users where id = ?", [userId]);
        const user = userRows[0];

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ message: "Incorrect current password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await db.query("update users set password = ? where id = ?", [hashed, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete account
router.delete("/profile/account", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        await db.query("delete from users where id = ?", [userId]);
        res.json({ message: "Account deleted" });
    } catch (err) {
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

// upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files allowed"));
        }
        cb(null, true);
    },
});

router.post(
    "/profileImage",
    verifyToken,
    upload.single("profile"),
    async (req, res) => {
        const connection = await db.getConnection();
        try {
            const imagePath = `/uploads/${req.file.filename}`;

            await connection.query(
                "update users set image_profile = ? where id = ?",
                [imagePath, req.user.id]
            );

            await connection.commit();

            res.json({ message: "Upload success", imagePath });
        } catch (err) {
            await connection.rollback();
            res.status(500).json({ error: err.message });
        } finally {
            connection.release();
        }
    }
);

router.post("/upload-image", verifyToken, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imagePath = `/uploads/${req.file.filename}`;
    res.json({ message: "Upload success", imagePath });
});

// verify if user is owner of instance
async function verifyInstanceOwner(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const [rows] = await db.query(
            "select * from course_instances where id = ? and owner_id = ?",
            [id, userId]
        );
        if (rows.length === 0 && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this instance" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// verify if user can edit a module (owner of instance it belongs to)
async function verifyModuleAccess(req, res, next) {
    try {
        const moduleId = req.params.id;
        const userId = req.user.id;

        const [rows] = await db.query(
            `select ci.owner_id 
             from course_modules cm
             left join course_instances ci on cm.instance_id = ci.id
             where cm.id = ?`,
            [moduleId]
        );

        if (rows.length === 0) return res.status(404).json({ message: "Module not found" });

        const ownerId = rows[0].owner_id;
        if (ownerId !== userId && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// verify if user can edit a lesson
async function verifyLessonAccess(req, res, next) {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id;
        const [rows] = await db.query(
            `select ci.owner_id 
             from course_lessons cl 
             join course_modules cm on cl.module_id = cm.id
             left join course_instances ci on cm.instance_id = ci.id
             where cl.id = ?`,
            [lessonId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Lesson not found" });
        if (rows[0].owner_id !== userId && !req.user.roles.includes('admin')) return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (err) { res.status(500).json({ error: err.message }); }
}

// verify if user can edit a quiz
async function verifyQuizAccess(req, res, next) {
    try {
        const quizId = req.params.id;
        const userId = req.user.id;
        const [rows] = await db.query(
            `select ci.owner_id 
             from course_quizzes cq
             join course_modules cm on cq.module_id = cm.id
             left join course_instances ci on cm.instance_id = ci.id
             where cq.id = ?`,
            [quizId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Quiz not found" });
        if (rows[0].owner_id !== userId && !req.user.roles.includes('admin')) return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (err) { res.status(500).json({ error: err.message }); }
}

// verify if user can edit an assignment
async function verifyAssignmentAccess(req, res, next) {
    try {
        const assId = req.params.id;
        const userId = req.user.id;
        const [rows] = await db.query(
            `select ci.owner_id 
             from course_assignments ca
             join course_modules cm on ca.module_id = cm.id
             left join course_instances ci on cm.instance_id = ci.id
             where ca.id = ?`,
            [assId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Assignment not found" });
        if (rows[0].owner_id !== userId && !req.user.roles.includes('admin')) return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (err) { res.status(500).json({ error: err.message }); }
}

// verify if user can edit a question
async function verifyQuestionAccess(req, res, next) {
    try {
        const qId = req.params.id;
        const userId = req.user.id;
        const [rows] = await db.query(
            `select ci.owner_id 
             from course_quiz_questions cqq
             join course_quizzes cq on cqq.quiz_id = cq.id
             join course_modules cm on cq.module_id = cm.id
             left join course_instances ci on cm.instance_id = ci.id
             where cqq.id = ?`,
            [qId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Question not found" });
        if (rows[0].owner_id !== userId && !req.user.roles.includes('admin')) return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (err) { res.status(500).json({ error: err.message }); }
}

// Video Upload Logic
const videoStorage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueName = "vid-" + uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit for videos
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only video files (mp4, webm, ogg, mov) are allowed"));
        }
        cb(null, true);
    },
});

router.post("/upload-video", verifyToken, videoUpload.single("video"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const videoPath = `/uploads/${req.file.filename}`;
    res.json({ message: "Video uploaded successfully", videoPath });
});

function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user.roles.includes(requiredRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

// --- Teacher Requests ---
router.post("/teacher-requests", verifyToken, upload.single("cv_file"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { school, cv_text } = req.body;

        let cvFilePath = null;
        if (req.file) {
            cvFilePath = `/uploads/${req.file.filename}`;
        }

        const connection = await db.getConnection();

        await connection.query(
            "INSERT INTO teacher_requests (user_id, school, cv_text, cv_file) VALUES (?, ?, ?, ?)",
            [userId, school, cv_text, cvFilePath]
        );
        res.status(201).json({ message: "Request submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/teacher-requests/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const connection = await db.getConnection();
        const [rows] = await connection.query(
            "SELECT * FROM teacher_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [userId]
        );
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/teacher-requests", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT tr.*, u.name, u.email, u.image_profile 
            FROM teacher_requests tr 
            JOIN users u ON tr.user_id = u.id 
            ORDER BY tr.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/teacher-requests/:id/approve", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const requestId = req.params.id;
        const connection = await db.getConnection();

        await connection.beginTransaction();
        const [reqRows] = await connection.query("SELECT user_id FROM teacher_requests WHERE id = ?", [requestId]);
        if (reqRows.length > 0) {
            const userId = reqRows[0].user_id;

            const [roleRows] = await connection.query("SELECT id FROM roles WHERE name = 'teacher'");
            if (roleRows.length > 0) {
                const roleId = roleRows[0].id;
                const [existing] = await connection.query("SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?", [userId, roleId]);
                if (existing.length === 0) {
                    await connection.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [userId, roleId]);
                }
            }

            await connection.query("UPDATE teacher_requests SET status = 'approved' WHERE id = ?", [requestId]);
        }
        await connection.commit();
        res.json({ message: "Approved successfully" });
    } catch (err) {
        // since connection was used with db.getConnection(), it might not have rollback exposed easily without try-catch variable scope
        try {
            await db.query("ROLLBACK");
        } catch (e) { }
        console.error("Approve error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/teacher-requests/:id/reject", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const requestId = req.params.id;
        await db.query("UPDATE teacher_requests SET status = 'rejected' WHERE id = ?", [requestId]);
        res.json({ message: "Rejected successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Initial DB setup and Verification
(async () => {
    try {
        await db.query("SELECT 1");
        console.log('Connected to SQLite Database');
    } catch (err) {
        console.error("DB Init/Connection Failed:", err.message);
    }
})();

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



