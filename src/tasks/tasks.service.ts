import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  private tasks: Task[] = [];
  public async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }
  public getTaskWithFilters(filterDto: GetTasksFilterDto) {
    //const { status, search } = filterDto;
    // const allTasks = this.getAllTasks();
    // const filteredTasks = allTasks
    //   .filter((task) => (status ? task.status === status : true))
    //   .filter((task) =>
    //     search
    //       ? task.title.toLowerCase().includes(search.toLowerCase()) ||
    //         task.description.toLowerCase().includes(search.toLowerCase())
    //       : true,
    //   );
    return; //filteredTasks;
  }
  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);

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
    return undefined;
  }
}
