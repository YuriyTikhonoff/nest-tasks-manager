import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  public getAllTasks(): Task[] {
    return this.tasks;
  }
  public getTaskWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    const allTasks = this.getAllTasks();
    const filteredTasks = allTasks
      .filter((task) => (status ? task.status === status : true))
      .filter((task) =>
        search
          ? task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase())
          : true,
      );
    return filteredTasks;
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
    const foundTask = this.tasks.find((task) => task.id === id);
    if (!foundTask)
      throw new NotFoundException(`The task with id ${id} is not found`);
    return foundTask;
  }
  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks;
  }
  public updateStatus(taskId: Task['id'], newStatus: TaskStatus) {
    let updatedTask = this.getTaskById(taskId);
    this.tasks = this.tasks.map((task) => {
      if (task.id !== taskId) return task;
      updatedTask = { ...task, status: newStatus };
      return updatedTask;
    });
    return updatedTask;
  }
}
