import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TaskDTO,
  TasksResponseDTO,
} from '../../application/ports/secondary/tasks.dto';
import { TasksRepository } from '../../application/ports/secondary/tasks.repository';

const mockTasks: TaskDTO[] = [
  {
    id: 'id1',
    title: 'Zrobić pranie',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
  },
  {
    id: 'id2',
    title: 'Kupić proszek do prania',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
  },
  {
    id: 'id3',
    title: 'Sprzątnąć szafę',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class TasksApiRepository implements TasksRepository {
  private apiUrl = 'http://localhost:3000/api/tasks'; // This will be configured based on environment

  counter = 3;

  constructor(private http: HttpClient) {}

  // getAll(): Observable<TaskDTO[]> {
  //   console.log('getAll')
  //   return this.http
  //     .get<TasksResponseDTO>(this.apiUrl)
  //     .pipe(map((response) => response.tasks));
  // }

  // getById(id: string): Observable<TaskDTO> {
  //   return this.http.get<TaskDTO>(`${this.apiUrl}/${id}`);
  // }

  // create(task: Partial<TaskDTO>): Observable<TaskDTO> {
  //   return this.http.post<TaskDTO>(this.apiUrl, task);
  // }

  // update(id: string, task: Partial<TaskDTO>): Observable<TaskDTO> {
  //   return this.http.patch<TaskDTO>(`${this.apiUrl}/${id}`, task);
  // }

  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }

  getAll(): Observable<TaskDTO[]> {
    return of(mockTasks);
  }

  getById(id: string): Observable<TaskDTO> {
    return of(mockTasks).pipe(
      map((tasks) => tasks.find((task) => task.id === id) || ({} as TaskDTO))
    );
  }

  create(task: Partial<TaskDTO>): Observable<TaskDTO> {
    this.counter = this.counter + 1;
    return of({
      id: `id${this.counter}`,
      title: task.title || '',
      description: task.description || '',
      createdAt: task.createdAt || new Date(),
      completed: false,
      updatedAt: task.createdAt || new Date(),
    });
  }

  update(id: string, task: Partial<TaskDTO>): Observable<TaskDTO> {
    return of(mockTasks).pipe(
      map((tasks) => {
        const completedTask = tasks.find((task) => task.id === id) || mockTasks[0];
        return {
          ...completedTask,
          completed: task.completed || false,
          updatedAt: task.updatedAt || new Date(),
        };
      })
    );
  }

  delete(id: string): Observable<void> {
    return of(void 0);
  }
}
