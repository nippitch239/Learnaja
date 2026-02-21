const db = require("./database.js");
const fs = require("fs");
const path = require("path");

async function migrate() {
    try {
        console.log("Starting migration...");
        const sqlPath = path.join(__dirname, "schema_v2.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        // Split by semicolon and filter out empty strings
        const statements = sql
            .split(";")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const connection = await db.getConnection();

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await connection.query(statement);
        }

        console.log("Migration completed successfully!");
        connection.release();
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err.message);
        process.exit(1);
    }
}

migrate();
