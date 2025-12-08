import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/measurements", async (req, res) => {
  const { city, temperature, humidity, pressure } = req.body;

  await db.run(
    `INSERT INTO measurements (city, temperature, humidity, pressure)
         VALUES (?, ?, ?, ?)`,
    [city, temperature, humidity, pressure]
  );

  res.json({ ok: true });
});

app.get("/api/measurements/latest", async (_, res) => {
  const rows = await db.all(`
        SELECT *
        FROM measurements
        ORDER BY createdAt DESC
        LIMIT 200
    `);
  res.json(rows);
});

app.listen(3001, () => console.log("🚀 API listening on http://localhost:3001"));
