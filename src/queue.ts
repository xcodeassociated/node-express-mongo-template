import ConsumerQueue from 'consumer-queue';

export const queue = new ConsumerQueue();

export function queueLoop(callback: (input: any) => void) {
  return queue.pop().then((value) => {
    callback(value);
    return queueLoop(callback);
  });
}
