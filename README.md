# ConsumerX
An asynchronous jobs (Promise | Async Function) consumer which can deal with priority based on RxJS, having error-handling and retry mechanism and can specify callback on success and failure.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX?ref=badge_shield)
[![Weekly Downloads](https://img.shields.io/npm/dw/consumer-x)](https://img.shields.io/npm/dw/consumer-x)

# Quick Start

## Install

[consumer-x](https://www.npmjs.com/package/consumer-x)
```shell
$ yarn add consumer-x
```

## Overview
### Introduction
ConsumerX is a simple asynchronous priority jobs consumer with error-handling and retry mechanism built with TypeScript and RxJS, which can run on Node.JS environment and browser.

## Basic Usage

```javascript
import ConsumerX from 'consumer-x';

const consumer = new ConsumerX(2, 100); // Parameters have default value: retryCount = 0, intervalTime = 200

// promise as job
const testPromiseResolve = () => {
  return new Promise(resolve => {
    resolve('resolve from promise');
  })
}

const testPromiseReject = () => {
  return new Promise((_resolve, reject) => {
    reject('reject from promise');
  })
}

// You can also push async function as job
const testAsync = async() => {
  try {
    const res = await testPromiseResolve();
    return res + '?No, is from async';
  } catch(err) {
    throw Error('error');
  }
}

consumer.push({
  task: testPromiseResolve,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
}, 3) // second argument is priority

consumer.push({
  task: testPromiseReject,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
}, 2)

consumer.push({
  task: testAsync,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
}) // If you don't specify the priority, the default value will be 5.  

/*
The console will log:

Failure  reject from promise
Failure  reject from promise
Failure  reject from promise
(Because the testPromiseReject's priority is highest, so it run first, and because we set the retryCount to 2 when we created the instance, so it will retry two time.)

Success  resolve from promise

Success  resolve from promise?No, is from async
(Default priority is 5, which is the lowest in this case.)
*/

```

## Running tests

```shell
$ yarn test
```

## Parameters

| Param        | Type     | Description                                                        |
|--------------|----------|--------------------------------------------------------------------|
| retryCount   | `number` | The retry count when job encounter failure. (Default Value = 0)    |
| intervalTime | `number` | The interval delay between each two tasks. (Default Value = 200ms) |
|              |          |                                                                    |

## Heap Based Priority Queue
ConsumerX implement a heap based priority queue, which has a better performance while popping the element (O(O(log n)) than linear data structure (O(n)). 

| Method         | Big O    |
|----------------|----------|
| insert | push  | O(log n) |
| size           | O(1)     |
| isEmpty        | O(1)     |
| peek           | O(1)     |
| pop            | O(log n) |

## Priority
You can specify priority of each task while pushing the task

```typescript
consumer.push({
  task: testPromise,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
}, 2);
```
The lower number has a higher priority than the bigger number, the default priority is 5.

## QueueEntity
```typescript
interface IQueueEntity<Result> {
  task: () => Promise<Result>;
  success?: (res: Result) => void;
  failure?: (err: unknown) => void;
}
```
currently accept promise and async function as job, will probably support other types in the future.

## Roadmap
  - [X] Implement priority queue
  - [ ] Increase unit test and maintain high testing coverage
  - [ ] Setup lint-stage and CI/CD pipeline
  - [ ] Take advantage of more RxJS features
  - [ ] Support pushing synchronous job
  - [ ] Add Prettier

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX?ref=badge_large)