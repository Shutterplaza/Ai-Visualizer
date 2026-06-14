import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import handler from "./api/visualize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "12mb" }));

app.post("/api/visualize", (req, res) => handler(req, res));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(__dirname));

export default app;
