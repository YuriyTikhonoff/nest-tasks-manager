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
  getAllTasks(@Query() filters: GetTasksFilterDto) {
    //** Alternative approach
    // if (Object.keys(filters).length)
    //   return this.taskService.getTaskWithFilters(filters);
    //*

    return this.taskService.getAllTasks(filters);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get("/:id")
  getTaskById(@Param() params: any): Promise<Task> {
    return this.taskService.getTaskById(params.id);
  }

  @Delete("/:id")
  deleteTask(@Param() params: any): Promise<void> {
    return this.taskService.deleteTask(params.id);
  }

  @Patch("/:id/status")
  updateStatus(
    @Param() params: any,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateStatus(params.id, status);
  }
}
