import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { ILike, Repository } from "typeorm";
import { TASK_ENTITY_NAME } from "./constants";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  public async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder(TASK_ENTITY_NAME);

    //** Alternative approach
    //const tasks = await this.taskRepository.find();
    //*
    console.log("search ", search);

    if (status) {
      query.andWhere("task.status = :status", { status });
    }
    if (search) {
      query.andWhere(
        "task.title ILIKE :search OR task.description ILIKE :search",
        { search: `%${search}%` },
      );
      //** We can use LOWER and LIKE operators instead of ILIKE because the last one is only applicable to PostrgeSQL
      //"LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)",
      //*
    }
    const tasks = query.getMany();
    return tasks;
  }
  public async getTaskWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    const tasks = await this.taskRepository.find({
      where: [
        { status: status },
        { title: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ],
    });
    return tasks;
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

  public async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
  public async updateStatus(taskId: Task["id"], newStatus: TaskStatus) {
    await this.taskRepository.update(
      { id: taskId },
      {
        status: newStatus,
      },
    );
    const updatedTask = await this.getTaskById(taskId);

    //** Alternative updating
    // const updatedTask = await this.getTaskById(taskId);
    // updatedTask.status = newStatus;
    // await this.taskRepository.save(updatedTask);
    //  */
    return updatedTask;
  }
}
