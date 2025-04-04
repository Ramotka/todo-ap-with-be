import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.schema';

@Controller('api/tasks') // Definiujemy, że ścieżka do API to /api/tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get() // Obsługuje zapytania GET na /api/tasks
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.findAll(); // Zwraca wszystkie zadania
  }

  @Post() // Obsługuje zapytania POST na /api/tasks
  async createTask(@Body() task: Partial<Task>): Promise<Task> {
    return this.tasksService.create(task); // Tworzy nowe zadanie
  }

  @Patch(':id') // Obsługuje zapytania PATCH na /api/tasks/:id
  async updateTask(
    @Param('id') id: string,
    @Body() task: Partial<Task>,
  ): Promise<Task> {
    return this.tasksService.update(id, task); // Aktualizuje zadanie o podanym ID
  }

  @Delete(':id') // Obsługuje zapytania DELETE na /api/tasks/:id
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.delete(id); // Usuwa zadanie o podanym ID
  }
}
