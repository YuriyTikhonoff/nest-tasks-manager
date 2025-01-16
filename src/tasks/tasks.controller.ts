import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

@Controller("/tasks")
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getAllTasks(@Query() filters: GetTasksFilterDto) {
    if (Object.keys(filters).length)
      return this.taskService.getTaskWithFilters(filters);
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get("/:id")
  getTaskById(@Param() params: any): Promise<Task> {
    return this.taskService.getTaskById(params.id);
  }

  @Delete("/:id")
  deleteTask(@Param() params: any): Task[] {
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
