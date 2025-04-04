import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec(); // Pobiera wszystkie zadania
  }

  async create(task: Partial<Task>): Promise<Task> {
    const newTask = new this.taskModel({
      ...task,
      completed: false,
      updatedAt: task.createdAt,
    });
    return newTask.save(); // Zapisuje nowe zadanie w bazie
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
    };

    const result = await this.taskModel
      .findByIdAndUpdate(id, updatedTask, { new: true, runValidators: true })
      .exec();

    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result; // Zwraca zaktualizowane zadanie
  }

  async delete(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return deletedTask; // Zwraca usunięte zadanie
  }
}
