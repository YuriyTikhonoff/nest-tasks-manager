import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('/tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param() params: any): Task {
    console.log(params.id);
    return this.taskService.getTaskById(params.id);
  }

  @Delete('/:id')
  deleteTask(@Param() params: any): Task[] {
    return this.taskService.deleteTask(params.id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param() params: any,
    @Body('status') status: TaskStatus,
  ): Task[] {
    return this.taskService.updateStatus(params.id, status);
  }
}
