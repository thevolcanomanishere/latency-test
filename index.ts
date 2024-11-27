import WebSocket from 'ws';
import { performance } from 'perf_hooks';

const PORT = 8080;
const MEASUREMENTS_COUNT = 10;

type Message = {
    type: 'ping' | 'pong';
    timestamp: number;
};

const startServer = () => {
    const server = new WebSocket.Server({ port: PORT });
    console.log(`Server listening on port ${PORT}`);

    server.on('connection', (ws) => {
        console.log('Client connected');
        ws.on('message', (data) => {
            const message: Message = JSON.parse(data.toString());
            if (message.type === 'ping') {
                ws.send(JSON.stringify({ type: 'pong', timestamp: message.timestamp }));
            }
        });
    });
};

const startClient = (serverUrl: string) => {
    const ws = new WebSocket(serverUrl);
    const measurements: number[] = [];

    ws.onopen = () => {
        console.log('Connected to server');
        sendPing();
    };

    ws.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        if (message.type === 'pong') {
            const latency = performance.now() - message.timestamp;
            measurements.push(latency);
            console.log(`Latency: ${latency.toFixed(2)}ms`);

            if (measurements.length >= MEASUREMENTS_COUNT) {
                printStats(measurements);
                ws.close();
            } else {
                setTimeout(sendPing, 1000);
            }
        }
    };

    const sendPing = () => {
        ws.send(JSON.stringify({ type: 'ping', timestamp: performance.now() }));
    };
};

const printStats = (measurements: number[]) => {
    const avg = measurements.reduce((a, b) => a + b) / measurements.length;
    console.log('\nLatency Statistics:');
    console.log(`Average: ${avg.toFixed(2)}ms`);
    console.log(`Min: ${Math.min(...measurements).toFixed(2)}ms`);
    console.log(`Max: ${Math.max(...measurements).toFixed(2)}ms`);
};

const mode = process.argv[2];
if (mode === 'server') {
    startServer();
} else if (mode === 'client') {
    const serverUrl = process.argv[3];
    if (!serverUrl) {
        console.error('Usage: ts-node script.ts client ws://server-ip:8080');
        process.exit(1);
    }
    startClient(serverUrl);
} else {
    console.error('Usage: ts-node script.ts [server|client] [server-url]');
    process.exit(1);
}