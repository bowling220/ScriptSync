const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const BASE_DIR = "C:\\RobloxTestAI";
const missingDirsLogged = new Set();

// Ensure base dir exists
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

// Helper to walk directory and get all files and directories
function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        if (list.length === 0) {
            results.push({ path: dir, isDir: true });
            return done(null, results);
        }
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.join(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    results.push({ path: file, isDir: true });
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if (file.endsWith('.lua')) {
                        results.push({ path: file, isDir: false });
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

                    if (content === "__FOLDER__") {
                        fs.mkdirSync(fullPath, { recursive: true });
                    } else {
                        // Create directories
                        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                        // Write file
                        fs.writeFileSync(fullPath, content, 'utf8');
                        count++;
                    }
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

    } else if (req.url.startsWith('/import') && req.method === 'GET') {
        const queryObject = url.parse(req.url, true).query;
        const sinceTime = parseInt(queryObject.since) || 0;

        if (!fs.existsSync(targetDir)) {
            if (!missingDirsLogged.has(targetDir)) {
                console.log(`Directory ${targetDir} does not exist, nothing to import.`);
                missingDirsLogged.add(targetDir);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ _serverTime: Date.now() }));
        }

        if (missingDirsLogged.has(targetDir)) {
            missingDirsLogged.delete(targetDir);
        }

        walk(targetDir, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: err.message }));
            }

            const data = { _serverTime: Date.now() };
            let addedCount = 0;
            files.forEach(item => {
                const stat = fs.statSync(item.path);
                // Also check ctimeMs since folders creation time matters
                if (stat.mtimeMs > sinceTime || stat.ctimeMs > sinceTime) {
                    // Calculate relative path using forward slashes for Studio
                    let relPath = path.relative(targetDir, item.path).split(path.sep).join('/');
                    if (relPath === "") return; // Skip the root directory itself

                    if (item.isDir) {
                        data[relPath] = "__FOLDER__";
                    } else {
                        data[relPath] = fs.readFileSync(item.path, 'utf8');
                    }
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                console.log(`Importing ${addedCount} scripts from ${targetDir} (since ${sinceTime})`);
            }
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
    console.log(`Roblox ScriptSync Server running on port ${PORT}...`);
    console.log(`Base Directory: ${BASE_DIR}`);
});
