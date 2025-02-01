import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { ILike, Repository } from "typeorm";
import { TASK_ENTITY_NAME } from "./constants";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService {
  private readonly logger = new Logger("TasksService");
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  public async getAllTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder(TASK_ENTITY_NAME);
    query.where({ user });

    //** Alternative approach
    //const tasks = await this.taskRepository.find();
    //*
    if (status) {
      query.andWhere("task.status = :status", { status });
    }
    if (search) {
      query.andWhere(
        "(task.title ILIKE :search OR task.description ILIKE :search)",
        { search: `%${search}%` },
      );
      //** We can use LOWER and LIKE operators instead of ILIKE because the last one is only applicable to PostrgeSQL
      //"LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)",
      //*
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new NotFoundException("Tasks not found");
    }
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
  public async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, user },
    });
    if (!foundTask)
      throw new NotFoundException(`The task with id ${id} is not found`);

    return foundTask;
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
  public async updateStatus(
    taskId: Task["id"],
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    await this.taskRepository.update(
      { id: taskId },
      {
        status: newStatus,
      },
    );
    const updatedTask = await this.getTaskById(taskId, user);

    //** Alternative updating
    // const updatedTask = await this.getTaskById(taskId);
    // updatedTask.status = newStatus;
    // await this.taskRepository.save(updatedTask);
    //  */
    return updatedTask;
  }
}
