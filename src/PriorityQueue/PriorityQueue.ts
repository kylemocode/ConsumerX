import { IQueueEntity } from '../types';
import { Node, IPriorityQueue } from './types';

export default class PriorityQueue<T> implements IPriorityQueue<T> {
  private queue: Node<T>[] = [];

  public isEmpty() {
    return this.queue.length === 0;
  }

  public size() {
    return this.queue.length;
  }

  public push(entity: IQueueEntity<T>, priority: number) {
    this.queue.push({ entity, priority });
  }

  public pop() {
    if(this.size() === 0) return null;

    let min = this.queue[0];
    let minIndex = 0;

    this.queue.forEach((item: Node<T>, index: number) => {
      if (item.priority < min.priority) {
        min = item;
        minIndex = index;
      } 
    })

    this.queue.splice(minIndex, 1);
    return min.entity;
  }
}
