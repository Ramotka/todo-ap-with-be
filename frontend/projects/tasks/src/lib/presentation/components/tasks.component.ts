import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksStorage } from '../../application/storage/tasks.storage';
import { take } from 'rxjs';

@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="tasks-container">
      <h2>Tasks</h2>

      <div *ngIf="store.loading()" class="loading">Loading...</div>

      <div *ngIf="store.error()" class="error">
        {{ store.error() }}
      </div>

      <div class="tasks-list">
        <div *ngFor="let task of store.tasks()" class="task-item">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="toggleTask(task.id, !task.completed)"
          />
          <span [class.completed]="task.completed">{{ task.title }}</span>
          <button (click)="deleteTask(task.id)">Delete</button>
        </div>
      </div>

      <div class="add-task">
        <input [(ngModel)]="newTaskTitle" placeholder="New task title" />
        <button (click)="addTask()">Add Task</button>
      </div>
    </div>
  `,
  styles: [
    `
      .tasks-container {
        padding: 20px;
      }
      .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .completed {
        text-decoration: line-through;
        color: #888;
      }
      .add-task {
        margin-top: 20px;
        display: flex;
        gap: 10px;
      }
      .loading {
        text-align: center;
        padding: 20px;
        color: #666;
      }
      .error {
        color: red;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid red;
        border-radius: 4px;
      }
    `,
  ],
})
export class TasksComponent implements OnInit {
  newTaskTitle = '';

  constructor(public store: TasksStorage) {}

  ngOnInit() {
    this.store.loadTasks().pipe(take(1)).subscribe();
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.store.addTask(this.newTaskTitle, '').pipe(take(1)).subscribe();
      this.newTaskTitle = '';
    }
  }

  toggleTask(id: string, completed: boolean) {
    this.store.completeTask(id, completed).pipe(take(1)).subscribe();
  }

  deleteTask(id: string) {
    this.store.deleteTask(id).pipe(take(1)).subscribe();
  }
}
