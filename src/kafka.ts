import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'node-client',
  brokers: ['localhost:9094'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'sample-group-node' });