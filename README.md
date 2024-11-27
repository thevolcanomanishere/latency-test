# Network Latency Measurement Tool

A simple WebSocket-based tool to measure network latency between two points.

## Requirements

- Node.js
- pnpm
- TypeScript

## Installation

```bash
pnpm add tsx ws @types/ws
```

## Usage

### Server Mode
Run on the machine that will act as the server:
```bash
tsx latency.ts server
```

### Client Mode
Run on the machine that will measure latency:
```bash
tsx latency.ts client
```
When prompted, enter the WebSocket URL (e.g., `ws://server-ip:8080`).

## How It Works

1. Server creates a WebSocket server on port 8080
2. Client connects to server and sends 'ping' messages
3. Server responds with 'pong' messages containing original timestamp
4. Client measures round-trip time
5. After 10 measurements, displays statistics:
   - Average latency
   - Minimum latency
   - Maximum latency

## Security Notes

- Open port 8080 on server's firewall
- Tool designed for testing between trusted endpoints
- No authentication implemented

## Limitations

- Basic error handling
- Fixed measurement count (10)
- No continuous monitoring
- No data persistence