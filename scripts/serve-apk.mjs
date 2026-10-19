import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const apkPath = path.join(projectRoot, 'release', 'hopi.apk');

const PORT = 8088;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/hopi.apk' || url.pathname === '/download') {
    if (!fs.existsSync(apkPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('APK file not found. Please compile the APK first.');
      return;
    }

    const stat = fs.statSync(apkPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="hopi.apk"',
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(apkPath);
    stream.pipe(res);
    return;
  }

  // Mobile landing page
  const stat = fs.existsSync(apkPath) ? fs.statSync(apkPath) : null;
  const sizeMb = stat ? (stat.size / (1024 * 1024)).toFixed(2) : '12.0';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Download Hopi v1.1.2</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FDFBF7;
      color: #3C332A;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid rgba(196, 112, 75, 0.2);
      border-radius: 28px;
      padding: 36px 28px;
      max-width: 380px;
      width: 100%;
      box-shadow: 0 12px 36px -8px rgba(100, 75, 55, 0.08);
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #C4704B, #E2B99C, #8C9E84);
    }
    .avatar {
      font-size: 54px;
      line-height: 1;
      margin-bottom: 16px;
      display: inline-block;
      filter: drop-shadow(0 4px 12px rgba(196, 112, 75, 0.25));
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #26211C;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      background: #F6EDE6;
      color: #C4704B;
      font-size: 12px;
      font-weight: 600;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
      color: #7A6F64;
      margin-bottom: 24px;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: #C4704B;
      color: #FFFFFF;
      text-decoration: none;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(196, 112, 75, 0.35);
      transition: transform 0.15s ease, background-color 0.15s ease;
    }
    .btn:active {
      transform: scale(0.98);
      background: #AA5A37;
    }
    .meta {
      margin-top: 18px;
      font-size: 12px;
      color: #A39688;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">🐰✨</div>
    <h1>Hopi Companion</h1>
    <div class="badge">Version 1.1.2 · Ready</div>
    <p>Your mindful daily routine companion with floating home screen overlay & voice reminders.</p>
    <a href="/hopi.apk" class="btn">
      <span>📥</span>
      <span>Download APK (${sizeMb} MB)</span>
    </a>
    <div class="meta">Tap the button above to begin downloading</div>
  </div>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`Hopi APK download server running at:`);
  console.log(`  http://${HOST}:${PORT}/`);
  console.log(`  http://localhost:${PORT}/`);
});
