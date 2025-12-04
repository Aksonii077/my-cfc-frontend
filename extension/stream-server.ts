import express from 'express';
import fs from 'fs';
import readline from 'readline';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/stream-analysis', async (req, res) => {
  const filePath = path.join(__dirname, 'backend_respinse.txt');

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = fs.createReadStream(filePath, 'utf-8');
  const rl = readline.createInterface({ input: stream });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed) {
      const data = JSON.stringify({ type: 'message', content: trimmed });
      res.write(`data: ${data}\n\n`);
      await new Promise(resolve => setTimeout(resolve, 50)); // simulate delay
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

app.listen(PORT, () => {
  console.log(`🚀 Streaming server running on http://localhost:${PORT}/api/stream-analysis`);
});
