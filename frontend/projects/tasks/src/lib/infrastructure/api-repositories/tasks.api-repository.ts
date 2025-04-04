import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TaskDTO,
  TasksResponseDTO,
} from '../../application/ports/secondary/tasks.dto';
import { TasksRepository } from '../../application/ports/secondary/tasks.repository';
import { environment } from 'src/environments/environment';

const mockTasks: TaskDTO[] = [
  {
    _id: 'id1',
    title: 'Zrobić pranie',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
  },
  {
    _id: 'id2',
    title: 'Kupić proszek do prania',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
  },
  {
    _id: 'id3',
    title: 'Sprzątnąć szafę',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class TasksApiRepository implements TasksRepository {
  private apiUrl = environment.apiUrl;

  counter = 3;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskDTO[]> {
    console.log('getAll');
    return this.http
      .get<TaskDTO[]>(this.apiUrl)
      .pipe(map((response) => response));
  }

  // getById(id: string): Observable<TaskDTO> {
  //   return this.http.get<TaskDTO>(`${this.apiUrl}/${id}`);
  // }

  create(task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(this.apiUrl, task);
  }

  update(id: string, task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.patch<TaskDTO>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: string): Observable<TaskDTO> {
    return of(mockTasks).pipe(
      map((tasks) => tasks.find((task) => task._id === id) || ({} as TaskDTO))
    );
  }
}
