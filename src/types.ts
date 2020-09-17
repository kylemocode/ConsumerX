export interface IQueueEntity<Result> {
  task: () => Promise<Result>;
  success?: (res: Result) => void;
  failure?: (err: unknown) => void;
}
