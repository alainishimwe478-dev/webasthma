import { createServer } from "node:http";
import { Server } from "socket.io";
import { createReadStream, existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createChatHandler } from "./server/chatHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const envPath = path.join(__dirname, ".env");
const isDev = process.argv.includes("--dev");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const parseEnvFile = (content) => {
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && !(key in process.env)) {
      values[key] = value;
    }
  }

  return values;
};

const loadLocalEnv = async () => {
  if (!existsSync(envPath)) {
    return;
  }

  const content = await fs.readFile(envPath, "utf8");
  Object.assign(process.env, parseEnvFile(content));
};

const sendText = (res, statusCode, text) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
};

const resolveAssetPath = async (pathname) => {
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(distDir, requestPath.replace(/^\/+/, ""));

  if (!filePath.startsWith(distDir)) {
    return null;
  }

  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      return filePath;
    }
  } catch {
    return null;
  }

  return null;
};

const serveFile = async (res, filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";

  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);

  await new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("end", resolve);
    stream.pipe(res);
  });
};

const runMiddleware = (middleware, req, res) =>
  new Promise((resolve, reject) => {
    let settled = false;

    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    res.once("finish", finish);
    res.once("close", finish);

    middleware(req, res, (error) => {
      if (settled) {
        return;
      }

      settled = true;
      res.off("finish", finish);
      res.off("close", finish);

      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const serveDevIndex = async (vite, req, res, pathname) => {
  const templatePath = path.join(__dirname, "index.html");
  let template = await fs.readFile(templatePath, "utf8");
  template = await vite.transformIndexHtml(pathname, template);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(template);
};

const isHtmlRoute = (pathname) => !path.extname(pathname);

await loadLocalEnv();

const handleChat = createChatHandler(process.env);

const httpServer = createServer(async (req, res) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  if (await handleChat(req, res)) {
    return;
  }

  if (isDev) {
    sendText(res, 404, "Use Vite dev server for the frontend. This server only provides /api in dev.");
    return;
  }

  if (!existsSync(distDir)) {
    sendText(
      res,
      503,
      "The production build is missing. Run `npm run build` before `npm run serve`.",
    );
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method not allowed.");
    return;
  }

  const assetPath = await resolveAssetPath(pathname);
  const fileToServe = assetPath || path.join(distDir, "index.html");

  try {
    await serveFile(res, fileToServe);
  } catch {
    sendText(res, 500, "Could not serve the application.");
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('message', (message) => {
    console.log('Message from', message.sender, ':', message.text);
    socket.broadcast.emit('message', message); // Broadcast to all others
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const server = httpServer;

const port = Number.parseInt(process.env.PORT || "4173", 10);

server.listen(port, () => {
  console.log(
    `Asthma Shield ${isDev ? "dev" : "production"} server running on http://localhost:${port}`,
  );
});
