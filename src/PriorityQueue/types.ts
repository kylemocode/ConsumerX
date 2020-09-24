import { IQueueEntity } from '../types';

export interface Node<T> {
  priority: number;
  entity: IQueueEntity<T>;
}

export interface IPriorityQueue<T> {
  push(entity: IQueueEntity<T>, priority: number): void;
  pop(): T;
  size(): number;
  isEmpty(): boolean;
}
