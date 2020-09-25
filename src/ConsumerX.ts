import { defer, interval, Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';

import PriorityQueue from './PriorityQueue';
import { IQueueEntity } from './types';

/**
   * @param retryCount the retry count for the task if it fail
   * @param intervalTime the interval delay between each two tasks (ms)
   */

export default class ConsumerX<Result> {
  private queue: PriorityQueue<Result>;
  private timer$?: Subscription;
  private retryCount: number;
  private intervalTime: number;
  public counter = 0;

  public constructor(retryCount = 0, intervalTime = 200) {
    this.retryCount = retryCount;
    this.intervalTime = intervalTime;
    this.queue = new PriorityQueue<Result>();
  }

  public size = this.queue?.size ?? 0;

  get isIdle(): boolean {
    return this.counter === 0;
  }

  private runInterval = () => {
    return interval(this.intervalTime)
      .subscribe(_x => {
        const task = this.queue.pop();
        if (task) this.execute(task);
        else return;
      })
  }

  private execute = (entity?: IQueueEntity<Result>) => {
    if (typeof entity === 'undefined') return;

    this.counter += 1;

    defer(entity.task)
      .pipe(
        retry(this.retryCount)
      )
      .subscribe({
        next: (value: any) => {
          entity?.success?.(value);
          this.counter -= 1;
        },
        error: (err: any) => {
          entity?.failure?.(err);
          this.counter -= 1;
        },
        complete: () => {
          if (this.isIdle && this.queue.size() === 0) {
            this.timer$?.unsubscribe();
            this.timer$ = undefined;
          }
        }
      })
  };

  public push = (entity: IQueueEntity<Result>, priority?: number) => {
    this.queue.push(entity, priority ?? 5);

    if (typeof this.timer$ === 'undefined') {
      this.timer$ = this.runInterval();
    }
  };
}
