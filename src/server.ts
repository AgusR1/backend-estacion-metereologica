import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Crear la tabla si no existe
await db.exec(`
    CREATE TABLE IF NOT EXISTS measurements (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                city TEXT NOT NULL,
                                                temperature REAL NOT NULL,
                                                humidity REAL NOT NULL,
                                                pressure REAL NOT NULL,
                                                createdAt DATETIME DEFAULT (datetime('now','localtime'))
        );
`);

// Guardar mediciones
app.post("/api/measurements", async (req, res) => {
  try {
    const {city, temperature, humidity, pressure} = req.body;

    if (
      typeof city !== "string" ||
      typeof temperature !== "number" ||
      typeof humidity !== "number" ||
      typeof pressure !== "number"
    ) {
      return res.status(400).json({error: "Invalid data format."});
    }

    await db.run(
      `
          INSERT INTO measurements (city, temperature, humidity, pressure)
          VALUES (?, ?, ?, ?)
      `,
      [city, temperature, humidity, pressure]
    );

    res.json({ok: true});
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({error: "Internal server error"});
  }
});

// Obtener últimos registros
app.get("/api/measurements/latest", async (_, res) => {
  try {
    const rows = await db.all(`
        SELECT id,
               city,
               temperature,
               humidity,
               pressure,
               datetime(createdAt, 'localtime') AS createdAt
        FROM measurements
        ORDER BY datetime(createdAt) DESC LIMIT 200
    `);

    res.json(rows);
  } catch (err) {
    console.error("Select error:", err);
    res.status(500).json({error: "Internal server error"});
  }
});

// Rango: últimas 12 horas
app.get("/api/measurements/range/12h", async (_, res) => {
  const rows = await db.all(
    `
        SELECT id,
               city,
               temperature,
               humidity,
               pressure,
               datetime(createdAt, 'localtime') AS createdAt
        FROM measurements
        WHERE datetime(createdAt) >= datetime('now', '-12 hours')
        ORDER BY datetime(createdAt) ASC
    `
  );
  res.json(rows);
});

// Rango: últimas 24 horas
app.get("/api/measurements/range/24h", async (_, res) => {
  const rows = await db.all(
    `
        SELECT id,
               city,
               temperature,
               humidity,
               pressure,
               datetime(createdAt, 'localtime') AS createdAt
        FROM measurements
        WHERE datetime(createdAt) >= datetime('now', '-24 hours')
        ORDER BY datetime(createdAt) ASC
    `
  );
  res.json(rows);
});

// Rango: últimos 7 días
app.get("/api/measurements/range/7d", async (_, res) => {
  const rows = await db.all(
    `
        SELECT id,
               city,
               temperature,
               humidity,
               pressure,
               datetime(createdAt, 'localtime') AS createdAt
        FROM measurements
        WHERE datetime(createdAt) >= datetime('now', '-7 days')
        ORDER BY datetime(createdAt) ASC
    `
  );
  res.json(rows);
});

// Rango: últimos 30 días
app.get("/api/measurements/range/30d", async (_, res) => {
  const rows = await db.all(
    `
        SELECT id,
               city,
               temperature,
               humidity,
               pressure,
               datetime(createdAt, 'localtime') AS createdAt
        FROM measurements
        WHERE datetime(createdAt) >= datetime('now', '-30 days')
        ORDER BY datetime(createdAt) ASC
    `
  );
  res.json(rows);
});

app.listen(3001, () =>
  console.log("API listening on http://localhost:3001")
);
