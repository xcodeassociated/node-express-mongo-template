import express, { Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDatabase } from './databaseConnection';
import { roleRoute } from './routes/role.route';
import { userRoute } from './routes/user.route';
import { main } from './socket/rsocket';
import http from 'http';
import * as WebSocket from 'ws';
import { eventEmitter } from './ApplicationEvents';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');
const WS_PORT = parseInt(process.env.WS_PORT || '4501');
const WS_PATH = '/ws';

main().catch((error: Error) => {
  console.error(error);
});

const app = express();

app.use(cors<Request>());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', roleRoute());
app.use('/', userRoute());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: WS_PATH });

const websockets = {};

type Message = {
  from: string;
  to: string;
  content: string;
};
wss.on('connection', (ws: WebSocket) => {
  console.log(`ws connected: ${ws}`);

  const userId: string = uuidv4();

  websockets[userId] = ws;

  ws.send(userId);

  ws.on('message', (msg) => {
    const message: Message = JSON.parse(msg.toString());
    const sink: WebSocket = websockets[message.to];

    sink.send(msg.toString());
  });

  ws.on('close', () => {
    console.log('ws was closed');
    for (const uid in websockets) {
      if (websockets.hasOwnProperty(uid)) {
        delete websockets[uid];
        console.log(`ws deleted: ${uid}`);
      }
    }
  });

  eventEmitter.on('user_created', (data) => {
    console.log(`EventEmitter received value: ${JSON.stringify(data)}`);
    ws.send(`USER_CREATED_NODE: ${data}`);
  });
});

server.listen(WS_PORT, () => {
  // @ts-ignore
  console.log(`WebSocket server started on URL: ${HOST}:${server.address().port}${WS_PATH}`);
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});
