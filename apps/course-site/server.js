const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const CONTENT_DIR = path.resolve(__dirname, 'content');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function safeJoin(baseDir, targetPath) {
  const normalizedTarget = path.normalize(targetPath).replace(/^([.][.][/\\])+/, '');
  const resolved = path.resolve(baseDir, normalizedTarget);
  if (!resolved.startsWith(baseDir)) {
    return null;
  }
  return resolved;
}

async function serveFile(res, filePath) {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const requestPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

  if (requestPath.startsWith('/content/')) {
    const contentPath = requestPath.replace('/content/', '');
    const filePath = safeJoin(CONTENT_DIR, contentPath);

    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Invalid path');
      return;
    }

    await serveFile(res, filePath);
    return;
  }

  const filePath = safeJoin(PUBLIC_DIR, requestPath.replace(/^\//, ''));

  if (!filePath) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Invalid path');
    return;
  }

  await serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Course site running on http://localhost:${PORT}`);
});
