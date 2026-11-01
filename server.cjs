// AICTE Complaint360 - Zero-Dependency Local Production Server (SIH26264)
// Runs directly on Node.js without needing node_modules or external packages.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const DIST = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const rawPath = req.url.split('?')[0];
  let filePath = path.join(DIST, rawPath === '/' ? 'index.html' : rawPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('===============================================================================');
  console.log('             AICTE COMPLAINT360 - OFFICIAL ENTERPRISE PORTAL');
  console.log('      Integrated Case Monitoring Dashboard Across AICTE Bureaus & Cells');
  console.log('                    Smart India Hackathon 2026 | SIH26264');
  console.log('===============================================================================');
  console.log('');
  console.log('  [STATUS] Production Server is LIVE on: http://localhost:' + PORT + '/');
  console.log('  [INFO]   Zero-dependency runtime active (< 100 clean project files).');
  console.log('');
  console.log('  Press Ctrl + C in this terminal window to stop the server.');
  console.log('===============================================================================');
});

