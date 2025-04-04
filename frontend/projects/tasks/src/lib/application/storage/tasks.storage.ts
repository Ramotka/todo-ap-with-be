import { Injectable, computed, effect, signal } from '@angular/core';
import { Observable, tap, catchError, finalize } from 'rxjs';
import { TasksApiRepository } from '../../infrastructure/api-repositories/tasks.api-repository';
import { TaskQueryResult } from '../ports/primary/query-result/tasks.query-result';
import {
  taskQueryResultFactory,
  tasksQueryResultFactory,
} from '../ports/primary/query-result/tasks.query-result-factory';
import { TaskDTO } from '../ports/secondary/tasks.dto';

type LoadTasksAction = { type: 'LOAD_TASKS' };
type AddTaskAction = {
  type: 'ADD_TASK';
  payload: { title: string; description: string };
};
type UpdateTaskAction = {
  type: 'UPDATE_TASK';
  payload: { id: string; title: string; description: string };
};
type DeleteTaskAction = { type: 'DELETE_TASK'; payload: { id: string } };
type CompleteTaskAction = {
  type: 'COMPLETE_TASK';
  payload: { id: string; completed: boolean };
};

type TaskAction =
  | LoadTasksAction
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | CompleteTaskAction;

@Injectable({
  providedIn: 'root',
})
export class TasksStorage {
  // Computed values
  tasks = computed(() => this.tasksSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  // Public methods that trigger effects
  loadTasks(): void {
    this.taskActionSignal.set({ type: 'LOAD_TASKS' });
  }

  addTask(title: string, description: string): void {
    this.taskActionSignal.set({
      type: 'ADD_TASK',
      payload: { title, description },
    });
  }

  updateTask(id: string, title: string, description: string): void {
    this.taskActionSignal.set({
      type: 'UPDATE_TASK',
      payload: { id, title, description },
    });
  }

  deleteTask(id: string): void {
    this.taskActionSignal.set({
      type: 'DELETE_TASK',
      payload: { id },
    });
  }

  completeTask(id: string, completed: boolean): void {
    this.taskActionSignal.set({
      type: 'COMPLETE_TASK',
      payload: { id, completed },
    });
  }

  constructor(private tasksApiRepository: TasksApiRepository) {
    // Task action effect
    effect(
      () => {
        const action = this.taskActionSignal();
        if (!action) return;

        switch (action.type) {
          case 'LOAD_TASKS':
            this.loadTasksEffect();
            break;
          case 'ADD_TASK':
            this.addTaskEffect(action.payload);
            break;
          case 'UPDATE_TASK':
            this.updateTaskEffect(action.payload);
            break;
          case 'DELETE_TASK':
            this.deleteTaskEffect(action.payload.id);
            break;
          case 'COMPLETE_TASK':
            this.completeTaskEffect(action.payload);
            break;
        }
      },
      { allowSignalWrites: true }
    );
  }

  // State
  private tasksSignal = signal<TaskQueryResult[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Action signal
  private taskActionSignal = signal<TaskAction | null>(null);

  // Private effect handlers
  private loadTasksEffect(): void {
    this.tasksApiRepository
      .getAll()
      .pipe(
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
        }),
        tap((tasks) => {
          console.log('tasks', tasks);
          const tasksQueryResult = tasks ? tasksQueryResultFactory(tasks) : [];
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
          this.taskActionSignal.set(null);
        })
      )
      .subscribe();
  }

  private addTaskEffect(data: { title: string; description: string }): void {
    const task: Partial<TaskDTO> = {
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
    };
    this.tasksApiRepository
      .create(task)
      .pipe(
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
        }),
        tap((newTask) => {
          const newTaskQueryResult = taskQueryResultFactory(newTask);
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
          this.taskActionSignal.set(null);
        })
      )
      .subscribe();
  }

  private updateTaskEffect(data: {
    id: string;
    title: string;
    description: string;
  }): void {
    const task: Partial<TaskDTO> = {
      title: data.title,
      description: data.description,
    };
    this.tasksApiRepository
      .update(data.id, task)
      .pipe(
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
        }),
        tap((updatedTask) => {
          const updatedTaskQueryResult = taskQueryResultFactory(updatedTask);
          this.tasksSignal.update((tasks) =>
            tasks.map((task) =>
              task.id === data.id ? updatedTaskQueryResult : task
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
          this.taskActionSignal.set(null);
        })
      )
      .subscribe();
  }

  private deleteTaskEffect(id: string): void {
    this.tasksApiRepository
      .delete(id)
      .pipe(
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
          this.taskActionSignal.set(null);
        })
      )
      .subscribe();
  }

  private completeTaskEffect(data: { id: string; completed: boolean }): void {
    const task: Partial<TaskDTO> = {
      completed: data.completed,
    };
    this.tasksApiRepository
      .update(data.id, task)
      .pipe(
        tap(() => {
          this.loadingSignal.set(true);
          this.errorSignal.set(null);
        }),
        tap((completedTask) => {
          const completedTaskQueryResult =
            taskQueryResultFactory(completedTask);
          this.tasksSignal.update((tasks) =>
            tasks.map((task) =>
              task.id === data.id ? completedTaskQueryResult : task
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
          this.taskActionSignal.set(null);
        })
      )
      .subscribe();
  }
}
