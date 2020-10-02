import ConsumerX from '../index';

let consumer: ConsumerX<unknown>;

beforeEach(() => {
  consumer = new ConsumerX();
});

test('Consumer should be idle when created', () => {
  expect(consumer.isIdle).toBe(true);
});

test('Queue size should be 0 when created', () => {
  expect(consumer.size).toBe(0);
});

test('Can push task in queue', () => {
  const testPromiseResolve = () => {
    return new Promise((resolve) => {
      resolve('resolve from promise');
    });
  };

  consumer.push(
    {
      task: testPromiseResolve,
      success: (res) => {
        console.log('Success ', res);
      },
      failure: (err) => {
        console.log('Failure ', err);
      },
    },
    3
  );

  expect(consumer.size).toBe(1);
});

test('Can pop task from queue', () => {
  const testPromiseResolve = () => {
    return new Promise((resolve) => {
      resolve('resolve from promise');
    });
  };

  consumer.push(
    {
      task: testPromiseResolve,
      success: (res) => {
        console.log('Success ', res);
      },
      failure: (err) => {
        console.log('Failure ', err);
      },
    },
    3
  );

  expect(consumer.size).toBe(1);
  expect(consumer.isIdle).toBe(true);

  consumer.queue.pop();

  expect(expect(consumer.size).toBe(0));
});
