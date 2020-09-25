export interface IQueueEntity<T> {
  task: () => Promise<T>;
  success?: (res: T) => void;
  failure?: (err: unknown) => void;
}
