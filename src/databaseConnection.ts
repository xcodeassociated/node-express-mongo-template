import mongoose, { ConnectionOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectionOptions = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };

  console.log(`connecting to mongodb: mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
};

export { connectToDatabase };
