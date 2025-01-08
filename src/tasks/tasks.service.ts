import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  public getAllTasks(): Task[] {
    return this.tasks;
  }
  public createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
  public getTaskById(id: string) {
    return this.tasks.find((task) => task.id === id);
  }
  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks;
  }
  public updateStatus(taskId: Task['id'], newStatus: TaskStatus) {
    let updatedTask;
    this.tasks = this.tasks.map((task) => {
      if (task.id !== taskId) return task;
      updatedTask = { ...task, status: newStatus };
      return updatedTask;
    });
    return updatedTask;
  }
}
