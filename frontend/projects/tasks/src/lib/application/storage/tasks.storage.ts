import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap, catchError, finalize, map } from 'rxjs';
import { TasksApiRepository } from '../../infrastructure/api-repositories/tasks.api-repository';
import { TaskQueryResult } from '../ports/primary/query-result/tasks.query-result';
import {
  taskQueryResultFactory,
  tasksQueryResultFactory,
} from '../ports/primary/query-result/tasks.query-result-factory';
import { TaskDTO } from '../ports/secondary/tasks.dto';

@Injectable({
  providedIn: 'root',
})
export class TasksStorage {
  // State
  private tasksSignal = signal<TaskQueryResult[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed values
  tasks = computed(() => this.tasksSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private tasksApiRepository: TasksApiRepository) {}

  loadTasks(): Observable<void> {
    return this.tasksApiRepository.getAll().pipe(
      tap(() => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
      }),
      tap((tasks) => {
        console.log('tasks', tasks);
        const tasksQueryResult: TaskQueryResult[] =
          tasksQueryResultFactory(tasks);
        this.tasksSignal.set(tasksQueryResult);
      }),
      catchError((error) => {
        this.errorSignal.set(
          error instanceof Error ? error.message : 'Failed to load tasks'
        );
        throw error;
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        console.log('loadTasks finalized');
      }),
      map(() => void 0)
    );
  }

  addTask(title: string, description: string): Observable<void> {
    const task: Partial<TaskDTO> = {
      title,
      description,
      createdAt: new Date(),
    };
    return this.tasksApiRepository.create(task).pipe(
      tap(() => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
      }),
      tap((newTask) => {
        const newTaskQueryResult: TaskQueryResult =
          taskQueryResultFactory(newTask);
        this.tasksSignal.update((tasks) => [...tasks, newTaskQueryResult]);
      }),
      catchError((error) => {
        this.errorSignal.set(
          error instanceof Error ? error.message : 'Failed to add task'
        );
        throw error;
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        console.log('addTask finalized');
      }),
      map(() => void 0)
    );
  }

  updateTask(id: string, title: string, description: string): Observable<void> {
    const task: Partial<TaskDTO> = {
      title,
      description,
      updatedAt: new Date(),
    };
    return this.tasksApiRepository.update(id, task).pipe(
      tap(() => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
      }),
      tap((updatedTask) => {
        const updatedTaskQueryResult: TaskQueryResult =
          taskQueryResultFactory(updatedTask);
        this.tasksSignal.update((tasks) =>
          tasks.map((task) => (task.id === id ? updatedTaskQueryResult : task))
        );
      }),
      catchError((error) => {
        this.errorSignal.set(
          error instanceof Error ? error.message : 'Failed to update task'
        );
        throw error;
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        console.log('updateTask finalized');
      }),
      map(() => void 0)
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.tasksApiRepository.delete(id).pipe(
      tap(() => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
      }),
      tap(() => {
        this.tasksSignal.update((tasks) =>
          tasks.filter((task) => task.id !== id)
        );
      }),
      catchError((error) => {
        this.errorSignal.set(
          error instanceof Error ? error.message : 'Failed to delete task'
        );
        throw error;
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        console.log('deleteTask finalized');
      })
    );
  }

  completeTask(id: string, completed: boolean): Observable<void> {
    const task: Partial<TaskDTO> = {
      completed,
      updatedAt: new Date(),
    };
    return this.tasksApiRepository.update(id, task).pipe(
      tap(() => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
      }),
      tap((completedTask) => {
        const completedTaskQueryResult: TaskQueryResult =
          taskQueryResultFactory(completedTask);

        this.tasksSignal.update((tasks) =>
          tasks.map((task) =>
            task.id === id ? completedTaskQueryResult : task
          )
        );
      }),
      catchError((error) => {
        this.errorSignal.set(
          error instanceof Error ? error.message : 'Failed to update task'
        );
        throw error;
      }),
      finalize(() => {
        this.loadingSignal.set(false);
        console.log('updateTask finalized');
      }),
      map(() => void 0)
    );
  }
}
