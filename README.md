# ConsumerX
An asynchronous jobs (Promise | Async Function) consumer based on RxJS, which has error-handling and retry mechanism and can specify callback on success and failure.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX?ref=badge_shield)
[![Weekly Downloads](https://img.shields.io/npm/dw/consumer-x)](https://img.shields.io/npm/dw/consumer-x)

# Quick Start

## Install

```shell
$ yarn add consumer-x
```

## Overview
### Introduction
ConsumerX is a simple asynchronous jobs consumer with error-handling and retry 
mechanism built with TypeScript and RxJS, which can run on Node.JS environment and browser.

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
})

consumer.push({
  task: testPromiseReject,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
})

consumer.push({
  task: testAsync,
  success: (res) => {
    console.log('Success ', res);
  },
  failure: (err) => {
    console.log('Failure ', err);
  }
})

/*
The console will log:
Success  resolve from promise
Failure  reject from promise
Success  resolve from promise?No, is from async
*/

```

## Running tests

```shell
$ yarn test
```

## Parameters

| Param        | Type      | Description | 
| retryCount    | `number`  | The retry count when job encounter failure. (Default Value = 0) |
| intervalTime    | `number`  | The interval delay between each two tasks. (Default Value = 200ms)|

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
  - [ ] Implement priority queue
  - [ ] Increase unit test and maintain high testing coverage
  - [ ] Setup lint-stage and CI/CD pipeline
  - [ ] Take advantage of more RxJS features
  - [ ] Support pushing synchronous job
  - [ ] Add Prettier

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkylemocode%2FConsumerX?ref=badge_large)