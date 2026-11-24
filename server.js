// Minimal static server for local preview (no dependencies)
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const envPort = Number(process.env.PORT);
const port = envPort > 0 ? envPort : 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || stat.isDirectory()) {
        filePath = path.join(root, "index.html");
      }
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
          return;
        }
        res.writeHead(200, {
          "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
          "Cache-Control": "no-cache",
        });
        res.end(data);
      });
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log("Listening on http://127.0.0.1:" + port);
  });
