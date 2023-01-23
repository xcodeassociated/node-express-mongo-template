import express, { Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDatabase } from './databaseConnection';
import { roleRoute } from './routes/role.route';
import { userRoute } from './routes/user.route';
import { main } from './socket/rsocket';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

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

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});
