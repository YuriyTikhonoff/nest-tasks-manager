import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "src/auth/user.entity";

@Controller("/tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getAllTasks(
    @Query() filters: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    //** Alternative approach
    // if (Object.keys(filters).length)
    //   return this.taskService.getTaskWithFilters(filters);
    //*

    return this.taskService.getAllTasks(filters, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get("/:id")
  getTaskById(@Param() params: any, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(params.id, user);
  }

  @Delete("/:id")
  deleteTask(@Param() params: any, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(params.id, user);
  }

  @Patch("/:id/status")
  updateStatus(
    @Param() params: any,
    @GetUser() user: User,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateStatus(params.id, status, user);
  }
}
