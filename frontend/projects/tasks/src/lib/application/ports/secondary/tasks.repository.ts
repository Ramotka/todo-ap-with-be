import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDTO } from './tasks.dto';

export const TASKS_REPOSITORY = new InjectionToken<TasksRepository>(
  'TASKS_REPOSITORY'
);

export interface TasksRepository {
  getAll(): Observable<TaskDTO[]>;
  getById(id: string): Observable<TaskDTO>;
  create(task: Partial<TaskDTO>): Observable<TaskDTO>;
  update(id: string, task: Partial<TaskDTO>): Observable<TaskDTO>;
  delete(id: string): Observable<void>;
}
