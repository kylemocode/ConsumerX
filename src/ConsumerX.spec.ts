import ConsumerX from './index';

test('Consumer should be idle when created', () => {
  const consumer = new ConsumerX();
  expect(consumer.isIdle).toBe(true);
})

test('Queue size should be 0 when created', () => {
  const consumer = new ConsumerX();
  expect(consumer.size).toBe(0);
})
