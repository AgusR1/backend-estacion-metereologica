import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

export const db = await open({
  filename: "./estacion.db",
  driver: sqlite3.Database,
});

await db.exec(`
CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    temperature REAL,
    humidity REAL,
    pressure REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);