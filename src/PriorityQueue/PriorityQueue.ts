import { IQueueEntity } from '../types';
import { Node, IPriorityQueue } from './types';

export default class PriorityQueue<T> implements IPriorityQueue<T> {
  private heap: Node<T>[] = [];

  _parent(index: number) {
    return Math.floor((index - 1) / 2);
  }

  _left(index: number) {
    return 2 * index + 1;
  }

  _right(index: number) {
    return 2 * index + 2;
  }

  _hasLeft(index: number) {
    return this._left(index) < this.heap.length;
  }

  _hasRight(index: number) {
    return this._right(index) < this.heap.length;
  }

  _swap(a: number, b: number) {
    const tmp = this.heap[a];
    this.heap[a] = this.heap[b];
    this.heap[b] = tmp;
  }

  public isEmpty() {
    return this.heap.length === 0;
  }

  public size() {
    return this.heap.length;
  }

  public push(entity: IQueueEntity<T>, priority: number) {
    this.heap.push({ entity, priority })

      let i = this.heap.length - 1;

      while(i > 0) {
        const p = this._parent(i);
        if (this.heap[p].priority < this.heap[i].priority) break;

        const tmp = this.heap[i];
        this.heap[i] = this.heap[p];
        this.heap[p] = tmp;
        i = p;
      }
  }

  public pop() {
    if(this.heap.length === 0) return null;
      
    this._swap(0, this.heap.length - 1);
    const item = this.heap.pop();

    let current = 0;

    while(this._hasLeft(current)) {
      let smallerChild = this._left(current);
      if (this._hasRight(current) && this.heap[this._right(current)].priority < this.heap[this._left(current)].priority) 
        smallerChild = this._right(current);

      if (this.heap[smallerChild].priority > this.heap[current].priority) break;

      this._swap(current, smallerChild);
      current = smallerChild;
    }

    return item?.entity;
  }
} 
