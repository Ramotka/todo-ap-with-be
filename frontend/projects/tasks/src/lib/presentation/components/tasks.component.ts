import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksStorage } from '../../application/storage/tasks.storage';
import { TaskQueryResult } from '../../application/ports/primary/query-result/tasks.query-result';

@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  isLoading: Signal<boolean> = computed(() => this.store.loading());
  error: Signal<string | null> = computed(() => this.store.error());
  tasks: Signal<TaskQueryResult[]> = computed(() => this.store.tasks());
  newTaskTitle = signal<string>('');

  constructor(public store: TasksStorage) {}

  ngOnInit() {
    this.store.loadTasks();
  }

  addTask() {
    if (this.newTaskTitle().trim()) {
      this.store.addTask(this.newTaskTitle(), '');
      this.newTaskTitle.set('');
    }
  }

  toggleTask(id: string, completed: boolean) {
    this.store.completeTask(id, completed);
  }

  deleteTask(id: string) {
    this.store.deleteTask(id);
  }
}
