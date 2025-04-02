export interface TasksResponseDTO {
  readonly tasks: TaskDTO[];
}

export interface TaskDTO {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
