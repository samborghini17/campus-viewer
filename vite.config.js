import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Custom Vite Plugin to allow saving level data from the UI directly to level-manager.js
const LevelSavePlugin = () => {
    return {
        name: 'level-save-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/__save-level' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString(); });
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            const id = data.id;
                            if (!id) throw new Error("No level id provided");

                            // Path to level-manager.js
                            const filepath = path.resolve(__dirname, 'files/assets/274249944/1/level-manager.js');
                            let content = fs.readFileSync(filepath, 'utf8');

                            // We need to find the object with id: 'ID' inside the levelConfig array
                            // Using a robust regex to find the block for the specific level ID
                            const regex = new RegExp(`({\\s*id:\\s*['"]${id}['"][\\s\\S]*?collider:\\s*null\\s*},?)`, 'g');
                            
                            // Check if it exists
                            if (!regex.test(content)) {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: `Level ID ${id} not found in config` }));
                                return;
                            }

                            // Build the replacement string
                            const replacement = `{ 
            id: '${id}', 
            url: '${data.url}', 
            envUrl: '${data.envUrl}', 
            splatPos: [${data.splatPos.join(', ')}], 
            splatRot: [${data.splatRot.join(', ')}], 
            cameraStart: [${data.cameraStart.join(', ')}],
            cameraStartRot: [${data.cameraStartRot.join(', ')}], 
            colliderPos: [${(data.colliderPos || [0,0,0]).join(', ')}],
            colliderRot: [${(data.colliderRot || [0,0,0]).join(', ')}],
            colliderScale: [${(data.colliderScale || [1,1,1]).join(', ')}],
            mode: '${data.mode || 'fly'}', 
            collider: null 
        },`;

                            content = content.replace(regex, replacement);
                            fs.writeFileSync(filepath, content, 'utf8');

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, message: `Level ${id} saved successfully!` }));
                        } catch (err) {
                            console.error("[Vite Plugin] Save Error:", err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                    });
                } else {
                    next();
                }
            });
        }
    };
};

export default defineConfig({
    plugins: [LevelSavePlugin()],
    server: {
        host: true,
        cors: true
    }
});
