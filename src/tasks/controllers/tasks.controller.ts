import { Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from '../services';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getJobs() {
    return this.tasksService.findAll();
  }

  @Get(':name')
  getJobDetails(@Param('name') name: string) {
    return this.tasksService.findOneByName(name);
  }

  @Post('stop/:name')
  stopJob(@Param('name') name: string) {
    return this.tasksService.stopJob(name);
  }

  @Post('start/:name')
  startJob(@Param('name') name: string) {
    return this.tasksService.startJob(name);
  }

  @Post('delete/:name')
  deleteJob(@Param('name') name: string) {
    return this.tasksService.deleteJob(name);
  }
}
