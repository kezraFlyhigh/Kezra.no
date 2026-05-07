const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = __dirname;

const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'text/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon'
};

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { html } = JSON.parse(body);
                fs.writeFileSync(path.join(DIR, 'index.html'), html, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch {
                res.writeHead(500);
                res.end('Save failed');
            }
        });
        return;
    }

    const url = req.url === '/' ? '/editor.html' : req.url;
    const filePath = path.join(DIR, url);
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });

}).listen(PORT, () => {
    console.log('');
    console.log('  Editor klar: http://localhost:' + PORT);
    console.log('  Avslutt med Ctrl+C');
    console.log('');
});
