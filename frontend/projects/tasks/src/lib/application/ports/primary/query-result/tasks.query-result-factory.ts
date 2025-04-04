import { TaskDTO } from '../../secondary/tasks.dto';
import { TaskQueryResult, TasksQueryResult } from './tasks.query-result';

export const tasksQueryResultFactory = (
  tasksData: TaskDTO[]
): TaskQueryResult[] => {
  const result: TaskQueryResult[] = tasksData.map((task) => ({
    ...task,
    id: task._id,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }));

  return result;
};

export const taskQueryResultFactory = (taskData: TaskDTO): TaskQueryResult => {
  const result: TaskQueryResult = {
    ...taskData,
    id: taskData._id,
    createdAt: new Date(taskData.createdAt),
    updatedAt: new Date(taskData.updatedAt),
  };

  return result;
};
