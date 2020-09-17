import { defer, interval, Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';

import { IQueueEntity } from './types';

/**
   * @param retryCount the retry count for the task if it fail
   * @param intervalTime the interval delay between each two tasks
   */

export default class ConsumerX<Result> {
  private queue: IQueueEntity<Result>[] = [];
  private timer$?: Subscription;
  private subscriptionList?: Subscription[] = [];
  private retryCount: number;
  private intervalTime: number;
  public counter = 0;

  public constructor(retryCount = 0, intervalTime = 200) {
    this.retryCount = retryCount;
    this.intervalTime = intervalTime;
  }

  public size = this.queue?.length ?? 0;

  get isIdle(): boolean {
    return this.counter === 0;
  }

  private runInterval = () => {
    return interval(this.intervalTime)
      .subscribe(_x => {
        const task = this.queue.shift();
        this.execute(task);
      })
  }

  private execute = (entity?: IQueueEntity<Result>) => {
    if (typeof entity === 'undefined') return;

    this.counter += 1;

    const subscription = defer(entity.task)
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
          if (this.isIdle && this.queue.length === 0) {
            this.timer$?.unsubscribe();
            this.timer$ = undefined;
            this.subscriptionList?.forEach(sub => sub.unsubscribe());
            this.subscriptionList = undefined;
          }
        }
      })

      this.subscriptionList?.push(subscription);
  };

  public push = (entity: IQueueEntity<Result>) => {
    this.queue.push(entity);

    if (typeof this.timer$ === 'undefined') {
      this.timer$ = this.runInterval();
    }
  };
}
