import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('/tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getAllTasks(@Query() filters: GetTasksFilterDto) {
    if (Object.keys(filters).length)
      return this.taskService.getTaskWithFilters(filters);
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param() params: any): Task {
    return this.taskService.getTaskById(params.id);
  }

  @Delete('/:id')
  deleteTask(@Param() params: any): Task[] {
    return this.taskService.deleteTask(params.id);
  }

  @Patch('/:id/status')
  updateStatus(@Param() params: any, @Body('status') status: TaskStatus) {
    return this.taskService.updateStatus(params.id, status);
  }
}
