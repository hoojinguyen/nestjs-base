import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksController } from './controllers';
import { TasksService } from './services';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
