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

app.use(cors({
    origin: "http://localhost:5173",
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

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
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

        const { title, description, price, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title required" });
        }

        const [result] = await connection.query(
            "insert into courses (title, description, price, category) values (?, ?, ?, ?)",
            [title, description, price, category]
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
        const { search } = req.query;
        let query = "select * from courses";
        let params = [];

        if (search) {
            query += " where title like ? or category like ?";
            params.push(`%${search}%`, `%${search}%`);
        }

        query += " order by created_at desc limit 10";

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
            "select * from course_instances where owner_id = ?",
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
            `select ci.* 
            from instance_students ist
            join course_instances ci on ist.instance_id = ci.id
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
            `select ci.*, c.thumbnail_url, c.category, c.price as original_price
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

            const [quizzes] = await db.query("select * from course_quizzes where module_id = ?", [module.id]);
            for (let quiz of quizzes) {
                const [questions] = await db.query("select * from course_quiz_questions where quiz_id = ?", [quiz.id]);
                quiz.questions = questions;
            }
            module.quizzes = quizzes;

            const [assignments] = await db.query("select * from course_assignments where module_id = ?", [module.id]);
            module.assignments = assignments;
        }

        instance.modules = modules;
        res.json(instance);
    } catch (err) {
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
        const { title, description, price, thumbnail_url, category } = req.body;

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
            "update courses set title = ?, description = ?, price = ?, thumbnail_url = ?, category = ? where id = ?",
            [title, description, price, thumbnail_url, category, id]
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
router.delete("/courses/:id", verifyToken, checkRole("admin"), async (req, res) => {
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

            const [quizzes] = await connection.query("select * from course_quizzes where module_id = ?", [mod.id]);
            for (let quiz of quizzes) {
                const [quizRes] = await connection.query(
                    "insert into course_quizzes (module_id, title, passing_score) values (?, ?, ?)",
                    [newModId, quiz.title, quiz.passing_score]
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

            const [assignments] = await connection.query("select * from course_assignments where module_id = ?", [mod.id]);
            for (let ass of assignments) {
                await connection.query(
                    "insert into course_assignments (module_id, title, description, max_score, submission_type) values (?, ?, ?, ?, ?)",
                    [newModId, ass.title, ass.description, ass.max_score, ass.submission_type]
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
        const { title, passing_score } = req.body;
        const [result] = await db.query(
            "insert into course_quizzes (module_id, title, passing_score) values (?, ?, ?)",
            [id, title, passing_score || 70]
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
        const { title, description, max_score, submission_type } = req.body;
        const [result] = await db.query(
            "insert into course_assignments (module_id, title, description, max_score, submission_type) values (?, ?, ?, ?, ?)",
            [id, title, description, max_score || 100, submission_type || 'file_upload']
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

// --- Progress Tracking ---

// Save Lesson/Assignment Progress
router.post("/instances/:id/progress", verifyToken, async (req, res) => {
    try {
        const { id: instanceId } = req.params;
        const { content_type, content_id } = req.body;
        const userId = req.user.id;

        await db.query(
            "INSERT INTO course_progress (user_id, instance_id, content_type, content_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP",
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

        await db.query(
            "INSERT INTO course_quiz_results (user_id, instance_id, quiz_id, score, passed) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, passed = ?, completed_at = CURRENT_TIMESTAMP",
            [userId, instanceId, quiz_id, score, passed, score, passed]
        );

        res.json({ message: "Quiz result saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Instance Progress
router.get("/instances/:id/progress", verifyToken, async (req, res) => {
    try {
        const { id: instanceId } = req.params;
        const userId = req.user.id;

        const [progressRows] = await db.query(
            "SELECT content_type, content_id FROM course_progress WHERE user_id = ? AND instance_id = ?",
            [userId, instanceId]
        );

        const [quizRows] = await db.query(
            "SELECT quiz_id, score, passed FROM course_quiz_results WHERE user_id = ? AND instance_id = ?",
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

function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user.roles.includes(requiredRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

// log check connection

// Initial DB setup and Verification
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to Database');

        connection.release();
    } catch (err) {
        console.error("DB Init/Connection Failed:", err.message);
    }
})();

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



