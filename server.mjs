import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8080;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "/main/index.html" : req.url);
  const ext = path.extname(filePath).toLowerCase();

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end("File not found");
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  exec(`start http://localhost:${port}/main/index.html`);
});