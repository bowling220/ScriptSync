const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\RobloxTestAI";

// Ensure base dir exists
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

// Helper to walk directory and get all files
function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.join(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if (file.endsWith('.lua')) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
}

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-game-name');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Get the game name from the header, default to 'UnknownGame'
    let gameName = req.headers['x-game-name'] || 'UnknownGame';
    // Sanitize the game name to prevent folder issues (allow letters, numbers, spaces, dashes, underscores)
    gameName = gameName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'UnknownGame';

    let targetDir = path.join(BASE_DIR, gameName);

    if (req.url === '/export' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                let count = 0;

                // Ensure target directory for this game exists
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }

                for (const [scriptPath, content] of Object.entries(data)) {
                    // Normalize path and prevent directory traversal
                    const normalizedPath = scriptPath.split(/[/\\]/).join(path.sep);
                    const fullPath = path.join(targetDir, normalizedPath);

                    // Create directories
                    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

                    // Write file
                    fs.writeFileSync(fullPath, content, 'utf8');
                    count++;
                }

                console.log(`Exported ${count} scripts to ${targetDir}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success' }));

            } catch (err) {
                console.error("Error processing export:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });

    } else if (req.url === '/import' && req.method === 'GET') {
        if (!fs.existsSync(targetDir)) {
            console.log(`Directory ${targetDir} does not exist, nothing to import.`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({}));
        }

        walk(targetDir, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: err.message }));
            }

            const data = {};
            files.forEach(file => {
                const content = fs.readFileSync(file, 'utf8');
                // Calculate relative path using forward slashes for Studio
                let relPath = path.relative(targetDir, file).split(path.sep).join('/');
                data[relPath] = content;
            });

            console.log(`Importing ${Object.keys(data).length} scripts from ${targetDir}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        });

    } else {
        res.writeHead(404);
        res.end("Not found");
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Roblox IDE Sync Server running on port ${PORT}...`);
    console.log(`Base Directory: ${BASE_DIR}`);
});
