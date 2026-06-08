const { spawn } = require('child_process');
const http = require('http');

console.log('Spawning Chrome...');
const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:5173/'
]);

chromeProcess.on('error', (err) => {
    console.error('Failed to start Chrome:', err);
});

// Wait for Chrome to initialize
setTimeout(() => {
    console.log('Connecting to Chrome DevTools Protocol...');
    http.get('http://127.0.0.1:9222/json/list', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const targets = JSON.parse(data);
                if (targets.length === 0) {
                    console.error('No pages found in Chrome!');
                    cleanup();
                    return;
                }
                
                const target = targets.find(t => t.url.includes('localhost:5173') && t.type === 'page') || targets.find(t => t.type === 'page');
                if (!target) {
                    console.error('Could not find active page target!');
                    cleanup();
                    return;
                }
                
                const wsUrl = target.webSocketDebuggerUrl;
                
                const ws = new WebSocket(wsUrl);
                
                ws.onopen = () => {
                    console.log('Connected. Enabling domains...');
                    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
                    ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
                    ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
                    ws.send(JSON.stringify({ id: 4, method: 'Page.enable' }));
                    
                    // Reload page to capture all load-time events
                    setTimeout(() => {
                        console.log('Reloading page...');
                        ws.send(JSON.stringify({ id: 5, method: 'Page.reload' }));
                    }, 500);
                };
                
                ws.onmessage = (event) => {
                    const msg = JSON.parse(event.data);
                    
                    if (msg.method === 'Runtime.consoleAPICalled') {
                        const args = msg.params.args.map(arg => arg.value || arg.description || JSON.stringify(arg));
                        console.log(`[Console] ${args.join(' ')}`);
                    } else if (msg.method === 'Log.entryAdded') {
                        const entry = msg.params.entry;
                        console.log(`[Log ${entry.level}] ${entry.text}`);
                    } else if (msg.method === 'Runtime.exceptionThrown') {
                        console.error(`[Exception] ${msg.params.exceptionDetails.text} - ${msg.params.exceptionDetails.exception.description}`);
                    } else if (msg.method === 'Network.responseReceived') {
                        const response = msg.params.response;
                        console.log(`[Network Response] ${response.status} - URL: ${response.url}`);
                    } else if (msg.method === 'Network.loadingFailed') {
                        console.error(`[Network Failed] ID: ${msg.params.requestId} - Error: ${msg.params.errorText}`);
                    }
                };
                
                ws.onerror = (err) => console.error('WS Error:', err);
                ws.onclose = () => console.log('WS closed.');
                
            } catch (err) {
                console.error('Error parsing DevTools targets:', err);
                cleanup();
            }
        });
    }).on('error', (err) => {
        console.error('Failed to connect to DevTools port 9222. Is Chrome running?', err);
        cleanup();
    });
}, 2500);

// Terminate after 15 seconds
setTimeout(() => {
    console.log('Test complete. Cleaning up...');
    cleanup();
}, 15000);

function cleanup() {
    try {
        chromeProcess.kill();
        console.log('Chrome process killed.');
    } catch (e) {}
    process.exit(0);
}
