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
import { consumer, producer } from './kafka';
import { sampleRoute } from './routes/sample.route';
import { externalRoute } from './routes/external.route';

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
app.use('/', sampleRoute());
app.use('/', externalRoute());

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
producer.on('producer.connect', (e) => {
  console.log(`KafkaProvider: connected`);
});
producer.on('producer.disconnect', (e) => {
  console.log(`KafkaProvider: could not connect`);
});
producer.on('producer.network.request_timeout', (payload) => {
  console.log(`KafkaProvider: request timeout ${payload}`);
});

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'sample_topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message, partition, topic }) => {
      console.log('[kafka]: rx: ');
      console.log({
        partition,
        topic,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });
};

run().catch(console.error);

// Producing
producer.connect().then(() => {
  console.log('sending kafka message...');
  producer
    .send({
      topic: 'sample_topic',
      messages: [{ value: 'hello node.js' }],
    })
    .then((e) => console.log('kafka message sent'));
});

eventEmitter.on('user_created', (data) => {
  console.log(`EventEmitter received value: ${JSON.stringify(data)}`);
  producer.send({
    topic: 'sample_topic',
    messages: [{ value: `USER_CREATED_NODE: ${data}` }],
  });
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});
