import ConsumerX from './index';

const testPromise = () => {
  return new Promise(resolve => {
    resolve('hahaha');
  })
}

const consumer = new ConsumerX(2, 100);

consumer.push({ task: testPromise , success: () => {
  console.log('success');
}, failure: () => { console.log('failure') }})