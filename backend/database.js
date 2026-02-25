require("dotenv").config();
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "database", "learnaja.db");

const sqlite = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
// Enable foreign key enforcement
sqlite.pragma("foreign_keys = ON");

/**
 * A thin async wrapper that mimics the mysql2/promise pool API used throughout index.js.
 *
 * Supported surface:
 *   db.query(sql, params)            → Promise<[rows, fields]>
 *   db.getConnection()               → Promise<connection>
 *   connection.query(sql, params)    → Promise<[rows/result, fields]>
 *   connection.beginTransaction()    → Promise<void>
 *   connection.commit()              → Promise<void>
 *   connection.rollback()            → Promise<void>
 *   connection.release()             → void (no-op for SQLite)
 */

function runQuery(sql, params = []) {
    // Flatten any array params (needed for IN (?) style – caller must pre-build placeholders)
    const flatParams = params.flat !== undefined ? params.flat(Infinity) : params;

    const trimmed = sql.trim().toUpperCase();
    if (
        trimmed.startsWith("SELECT") ||
        trimmed.startsWith("PRAGMA") ||
        trimmed.startsWith("WITH")
    ) {
        const rows = sqlite.prepare(sql).all(...flatParams);
        return [rows, []];
    } else {
        const info = sqlite.prepare(sql).run(...flatParams);
        // Return a mysql2-style result object
        const result = {
            insertId: info.lastInsertRowid,
            affectedRows: info.changes,
        };
        return [result, []];
    }
}

// A fake "connection" object that supports transactions
function makeConnection() {
    let inTransaction = false;
    return {
        query(sql, params) {
            return Promise.resolve(runQuery(sql, params));
        },
        beginTransaction() {
            if (!inTransaction) {
                sqlite.prepare("BEGIN").run();
                inTransaction = true;
            }
            return Promise.resolve();
        },
        commit() {
            if (inTransaction) {
                sqlite.prepare("COMMIT").run();
                inTransaction = false;
            }
            return Promise.resolve();
        },
        rollback() {
            if (inTransaction) {
                try { sqlite.prepare("ROLLBACK").run(); } catch (_) { }
                inTransaction = false;
            }
            return Promise.resolve();
        },
        release() {
            // no-op – SQLite is embedded, no connection pool
        },
    };
}

const db = {
    query(sql, params) {
        return Promise.resolve(runQuery(sql, params));
    },
    getConnection() {
        return Promise.resolve(makeConnection());
    },
    // Expose the raw sqlite instance for the init script
    _sqlite: sqlite,
};

module.exports = db;
