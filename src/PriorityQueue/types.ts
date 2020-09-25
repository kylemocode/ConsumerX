import { IQueueEntity } from '../types';

export interface Node<T> {
  priority: number;
  entity: IQueueEntity<T>;
}

export interface IPriorityQueue<T> {
  push(entity: IQueueEntity<T>, priority: number): void;
  pop(): IQueueEntity<T> | undefined | null;
  size(): number;
  isEmpty(): boolean;
}
