import { IQueueEntity } from '../types';
import { Node, IPriorityQueue } from './types';

export default class PriorityQueue<T> implements IPriorityQueue<T> {
  private queue: Node<T>[] = [];

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public size(): number {
    return this.queue.length;
  }

  public push(entity: IQueueEntity<T>, priority: number): void {
    this.queue.push({ entity, priority });
  }

  public pop(): IQueueEntity<T> | null {
    if (this.size() === 0) return null;

    let min = this.queue[0];
    let minIndex = 0;

    this.queue.forEach((item: Node<T>, index: number) => {
      if (item.priority < min.priority) {
        min = item;
        minIndex = index;
      }
    });

    this.queue.splice(minIndex, 1);
    return min.entity;
  }
}
