import express from 'express';
import mongoose from 'mongoose';
import { roleRoute } from '../../routes/role.route';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', roleRoute());

describe('testing-server-routes', () => {
  beforeAll(async () => {
    // @ts-ignore
    await mongoose.connect(process.env['MONGO_URI']);
  });

  afterAll(async () => {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];

      // @ts-ignore
      collection.deleteMany();
    }
    await mongoose.disconnect();
  });

  it('GET /roles - success', async () => {
    const { body } = await request(app).get('/permissions');

    expect(body).toEqual([]);
  });

  it('POST /roles - success', async () => {
    const { body } = await request(app)
      .post('/permissions')
      .send({ name: 'test-name', description: 'test-description' })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/);

    expect(body.name).toEqual('test-name');
    expect(body.description).toEqual('test-description');
  });
});
