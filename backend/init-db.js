/**
 * init-db.js
 * Run once to create the SQLite schema and (optionally) seed initial data.
 *   node init-db.js
 *   node init-db.js --seed   ← also inserts the sample data from the MySQL dump
 */
require("dotenv").config();
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "learnaja.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = OFF"); // OFF during schema creation to avoid ordering issues

const schema = `
CREATE TABLE IF NOT EXISTS roles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(45)  NOT NULL,
    email         VARCHAR(50)  NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    points        INTEGER DEFAULT 0,
    image_profile VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    price         REAL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thumbnail_url TEXT,
    category      VARCHAR(100),
    rating        REAL    DEFAULT 0,
    rating_count  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS course_instances (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    owner_id    INTEGER NOT NULL,
    title       VARCHAR(100),
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS course_modules (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id          INTEGER DEFAULT NULL,
    instance_id        INTEGER DEFAULT NULL,
    title              VARCHAR(255) NOT NULL,
    order_index        INTEGER DEFAULT 0,
    template_module_id INTEGER DEFAULT NULL,
    FOREIGN KEY (course_id)   REFERENCES courses(id)          ON DELETE CASCADE,
    FOREIGN KEY (instance_id) REFERENCES course_instances(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id        INTEGER NOT NULL,
    title            VARCHAR(255) NOT NULL,
    type             VARCHAR(20)  NOT NULL,  -- video | reading | link
    duration_minutes INTEGER DEFAULT 0,
    content          TEXT,                   -- stored as JSON string
    order_index      INTEGER DEFAULT 0,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_assignments (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id       INTEGER NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    max_score       INTEGER DEFAULT 100,
    submission_type VARCHAR(50)  DEFAULT 'file_upload',
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_quizzes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id     INTEGER NOT NULL,
    title         VARCHAR(255) NOT NULL,
    passing_score INTEGER DEFAULT 70,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_quiz_questions (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id        INTEGER NOT NULL,
    question       TEXT    NOT NULL,
    type           VARCHAR(50) DEFAULT 'multiple_choice',
    choices        TEXT,        -- JSON
    correct_answer TEXT,
    points         INTEGER DEFAULT 10,
    FOREIGN KEY (quiz_id) REFERENCES course_quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_ratings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id  INTEGER NOT NULL,
    user_id    INTEGER NOT NULL,
    rating     INTEGER NOT NULL,
    comment    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instance_students (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    instance_id INTEGER,
    user_id     INTEGER,
    FOREIGN KEY (instance_id) REFERENCES course_instances(id),
    FOREIGN KEY (user_id)     REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS course_progress (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    instance_id  INTEGER NOT NULL,
    content_type VARCHAR(20)  NOT NULL,  -- lesson | assignment
    content_id   INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, instance_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS course_quiz_results (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    instance_id  INTEGER NOT NULL,
    quiz_id      INTEGER NOT NULL,
    score        INTEGER NOT NULL,
    passed       INTEGER NOT NULL,  -- 0 or 1
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, instance_id, quiz_id)
);
`;

db.exec(schema);
console.log("✅ Schema created (or already exists).");

const seed = process.argv.includes("--seed");

if (seed) {
    const insert = db.transaction(() => {
        // roles
        const insertRole = db.prepare("INSERT OR IGNORE INTO roles (id, name, description, created_at) VALUES (?, ?, ?, ?)");
        insertRole.run(1, 'admin', 'System administrator', '2026-02-13 11:01:40');
        insertRole.run(2, 'teacher', 'Course instructor', '2026-02-13 11:01:40');
        insertRole.run(3, 'student', 'Learner', '2026-02-13 11:01:40');

        // permissions
        const insertPerm = db.prepare("INSERT OR IGNORE INTO permissions (id, name, description, created_at) VALUES (?, ?, ?, ?)");
        insertPerm.run(1, 'manage_users', 'Manage all users', '2026-02-13 11:01:57');
        insertPerm.run(2, 'create_course', 'Create new course', '2026-02-13 11:01:57');
        insertPerm.run(3, 'delete_course', 'Delete course', '2026-02-13 11:01:57');
        insertPerm.run(4, 'view_dashboard', 'Access dashboard', '2026-02-13 11:01:57');
        insertPerm.run(5, 'enroll_course', 'Enroll in course', '2026-02-13 11:01:57');
        insertPerm.run(6, 'view_course', 'View course content', '2026-02-13 11:01:57');
        insertPerm.run(7, 'invite_student', 'Invite student into course', '2026-02-16 09:12:18');

        // role_permissions
        const insertRP = db.prepare("INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
        [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [1, 6], [2, 6], [3, 6], [1, 7], [2, 7]].forEach(([r, p]) => insertRP.run(r, p));

        // users  (passwords are bcrypt hashes from the original dump)
        const insertUser = db.prepare("INSERT OR IGNORE INTO users (id, username, name, email, password, points, image_profile) VALUES (?, ?, ?, ?, ?, ?, ?)");
        insertUser.run(1, 'pitch', 'Pitch', 'pitch@gmail.com', '$2b$10$1LMV3bcrIWbiDHrBRCHAOeDOzId7oKcDp4Pjqlo8KmN4H/IHko7d.', 2243, null);
        insertUser.run(2, 'ab', 'abww', 'ab@gmail.com', '$2b$10$VVSHJuGIjhTse4PXzGedP.Ns90jfsnMCF6NGu86ltHaeSGjPa/4SK', 222093, '/uploads/9ac103bf-15c6-4da5-8b62-af71f09d0d2f.jpg');
        insertUser.run(3, 'lnwza', 'abc def', 'awdawdwad@gmail.com', '$2b$10$M8M9XgwyC94rEch3Yaz0X.p0BqtuVdUIT6UPJlrLYuiCJNuu2r2Xy', 2222222221992, null);

        // user_roles
        const insertUR = db.prepare("INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)");
        [[2, 1], [2, 2], [1, 3], [3, 3]].forEach(([u, r]) => insertUR.run(u, r));

        // courses
        const insertCourse = db.prepare("INSERT OR IGNORE INTO courses (id, title, description, price, created_at, thumbnail_url, category, rating, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        insertCourse.run(1, 'test1', 'lorem asidjoiwgt', 230, '2026-02-16 14:04:58', 'https://static01.nyt.com/images/2020/01/28/multimedia/28xp-memekid3/28cp-memekid3-superJumbo.jpg', null, 1.5, 2);
        insertCourse.run(6, 'test-2', '', 222, '2026-02-21 07:11:01', null, null, 0, 0);
        insertCourse.run(7, 'tes3', '', 0, '2026-02-21 07:11:55', null, null, 0, 0);
        insertCourse.run(8, 'tes4', '', 0, '2026-02-21 07:13:47', null, null, 0, 0);
        insertCourse.run(9, 'test5', '', 0, '2026-02-21 07:14:23', null, null, 0, 0);
        insertCourse.run(10, 'tes6', '', 0, '2026-02-21 07:29:49', null, null, 0, 0);

        // course_instances
        const insertCI = db.prepare("INSERT OR IGNORE INTO course_instances (id, template_id, owner_id, title, description, created_at) VALUES (?,?,?,?,?,?)");
        insertCI.run(1, 1, 2, 'test1', 'lorem asidjoiwgt', '2026-02-21 03:50:47');
        insertCI.run(2, 6, 2, 'test-2', '', '2026-02-21 07:46:36');
        insertCI.run(3, 1, 1, 'test1', 'lorem asidjoiwgt', '2026-02-21 14:14:13');
        insertCI.run(4, 10, 3, 'tes6', '', '2026-02-21 14:36:37');
        insertCI.run(5, 1, 3, 'test1', 'lorem asidjoiwgt', '2026-02-24 14:55:33');

        // course_modules
        const insertMod = db.prepare("INSERT OR IGNORE INTO course_modules (id, course_id, instance_id, title, order_index, template_module_id) VALUES (?,?,?,?,?,?)");
        insertMod.run(1, 9, null, 'w', 0, null);
        insertMod.run(5, null, 1, 'awd', 0, null);
        insertMod.run(15, null, 1, 'wad', 1, null);

        // course_lessons
        const insertLesson = db.prepare("INSERT OR IGNORE INTO course_lessons (id, module_id, title, type, duration_minutes, content, order_index) VALUES (?,?,?,?,?,?,?)");
        insertLesson.run(1, 1, 'ab', 'video', 10, '{"video_url": ""}', 0);
        insertLesson.run(4, 5, 'd', 'video', 10, '{"video_url": "https://www.youtube.com/watch?v=ZN7iH6xT7sI"}', 0);

        // course_assignments
        db.prepare("INSERT OR IGNORE INTO course_assignments (id, module_id, title, description, max_score, submission_type) VALUES (?,?,?,?,?,?)").run(1, 1, 'awd', '', 100, 'file_upload');

        // course_quizzes
        db.prepare("INSERT OR IGNORE INTO course_quizzes (id, module_id, title, passing_score) VALUES (?,?,?,?)").run(3, 5, 'ำ', 70);

        // course_quiz_questions
        db.prepare("INSERT OR IGNORE INTO course_quiz_questions (id, quiz_id, question, type, choices, correct_answer, points) VALUES (?,?,?,?,?,?,?)").run(2, 3, 'asnwewewe', 'multiple_choice', '["a","b","c"]', '[1]', 10);

        // course_ratings
        const insertRating = db.prepare("INSERT OR IGNORE INTO course_ratings (id, course_id, user_id, rating, comment, created_at) VALUES (?,?,?,?,?,?)");
        insertRating.run(1, 1, 1, 2, 'กาก', '2026-02-24 17:02:31');
        insertRating.run(2, 1, 2, 1, 'ดียังไงวะ', '2026-02-24 17:05:35');

        // instance_students
        db.prepare("INSERT OR IGNORE INTO instance_students (id, instance_id, user_id) VALUES (?,?,?)").run(5, 1, 1);

        // course_progress
        const insertProg = db.prepare("INSERT OR IGNORE INTO course_progress (id, user_id, instance_id, content_type, content_id, completed_at) VALUES (?,?,?,?,?,?)");
        insertProg.run(1, 2, 1, 'lesson', 3, '2026-02-23 18:43:17');
        insertProg.run(17, 2, 1, 'lesson', 4, '2026-02-24 16:52:40');
        insertProg.run(28, 1, 1, 'lesson', 4, '2026-02-24 16:55:35');
        insertProg.run(30, 1, 3, 'lesson', 3, '2026-02-24 14:03:24');
        insertProg.run(107, 2, 1, 'lesson', 5, '2026-02-24 14:29:52');

        // course_quiz_results
        const insertQR = db.prepare("INSERT OR IGNORE INTO course_quiz_results (id, user_id, instance_id, quiz_id, score, passed, completed_at) VALUES (?,?,?,?,?,?,?)");
        insertQR.run(1, 2, 1, 2, 10, 1, '2026-02-23 18:32:51');
        insertQR.run(2, 2, 1, 4, 0, 0, '2026-02-23 18:58:39');
        insertQR.run(4, 2, 1, 5, 10, 1, '2026-02-23 18:59:15');
        insertQR.run(6, 1, 1, 3, 10, 1, '2026-02-23 19:12:40');
        insertQR.run(7, 1, 1, 5, 10, 1, '2026-02-23 19:12:44');
    });

    insert();
    console.log("✅ Seed data inserted.");
}

db.pragma("foreign_keys = ON");
db.close();
console.log("Done. Database file:", DB_PATH);
