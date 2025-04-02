import { TaskDTO } from '../../secondary/tasks.dto';
import { TaskQueryResult, TasksQueryResult } from './tasks.query-result';

export const tasksQueryResultFactory = (
  tasksData: TaskDTO[]
): TaskQueryResult[] => {
  const result: TaskQueryResult[] = tasksData;

  return result;
};

export const taskQueryResultFactory = (taskData: TaskDTO): TaskQueryResult => {
  const result: TaskQueryResult = taskData;

  return result;
};
