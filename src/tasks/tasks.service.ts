import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task.model";
import { v4 as uuid } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}
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
  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskRepository.findOneBy({ id });
    if (!foundTask)
      throw new NotFoundException(`The task with id ${id} is not found`);

    return foundTask;
  }
  // public getTaskById(id: string) {
  //   const foundTask = this.tasks.find((task) => task.id === id);
  //   if (!foundTask)
  //     throw new NotFoundException(`The task with id ${id} is not found`);
  //   return foundTask;
  // }
  public deleteTask(id: string) {
    this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks;
  }
  public updateStatus(taskId: Task["id"], newStatus: TaskStatus) {
    let updatedTask = this.getTaskById(taskId);
    this.tasks = this.tasks.map((task) => {
      if (task.id !== taskId) return task;
      updatedTask = { ...task, status: newStatus };
      return updatedTask;
    });
    return updatedTask;
  }
}
