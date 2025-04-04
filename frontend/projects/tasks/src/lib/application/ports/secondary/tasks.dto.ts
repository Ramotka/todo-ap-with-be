export interface TasksResponseDTO {
  readonly tasks: TaskDTO[];
}

export interface TaskDTO {
  readonly _id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
