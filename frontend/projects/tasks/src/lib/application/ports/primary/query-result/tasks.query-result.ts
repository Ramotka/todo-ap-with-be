export interface TasksQueryResult {
  readonly tasks: TaskQueryResult[];
}

export interface TaskQueryResult {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
