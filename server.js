import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import handler from "./api/visualize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json({ limit: "12mb" }));
app.post("/api/visualize", (req, res) => handler(req, res));
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Shutter Plaza AI Visualizer draait op http://localhost:${port}`);
});
