import { WinstonProvider } from '@/src/utils/providers';
import { FileService, S3Service } from '@/src/utils/services';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { ExceptionsResponse } from '../exceptions';

@Injectable()
export class TasksService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly logger: WinstonProvider,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  public findAll(): any[] {
    const jobs = this.schedulerRegistry.getCronJobs();
    const data = [];

    for (const [key, value] of jobs) {
      const lastDate = value.lastDate();
      let nextDate: any;
      try {
        nextDate = value.nextDates().toDate();
      } catch (e) {
        nextDate = 'error: next fire date is in the past!';
      }
      data.push({ name: key, running: value.running, nextDate, lastDate });
    }

    return data;
  }

  public findOneByName(name: string): any {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      const lastDate = job.lastDate();

      let nextDate: any;
      try {
        nextDate = job.nextDates().toDate();
      } catch (e) {
        nextDate = 'error: next fire date is in the past!';
      }

      return { name, running: job.running, nextDate, lastDate };
    } catch (error) {
      throw new NotFoundException(ExceptionsResponse.jobNotFound);
    }
  }

  public addCronJob(name: string, time: string, fnExecute: () => void): any {
    const job = new CronJob(time, fnExecute);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    return this.findOneByName(name);
  }

  public stopJob(name: string): boolean {
    try {
      const job = this.schedulerRegistry.getCronJob(name);

      job.stop();

      return true;
    } catch (error) {
      throw new NotFoundException(ExceptionsResponse.jobNotFound);
    }
  }

  public startJob(name: string): boolean {
    try {
      const job = this.schedulerRegistry.getCronJob(name);

      job.start();

      return true;
    } catch (error) {
      throw new NotFoundException(ExceptionsResponse.jobNotFound);
    }
  }

  public deleteJob(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);

      if (job) {
        console.log('vo');
        this.schedulerRegistry.deleteCronJob(name);
      }

      return true;
    } catch (error) {
      throw new NotFoundException(ExceptionsResponse.jobNotFound);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'deleteUploadTempFolder',
  })
  async deleteUploadTempFolder() {
    const { serverUpload } = this.configService.get('app');
    const date = moment().format('dddd, YYYY/MM/DD, HH:mm:ss A');

    let message = '';
    let folder = '';

    if (serverUpload !== 'local') {
      const { dest } = this.configService.get('file');
      folder = `${dest.root}/${dest.tmp}`;
      message = 'Job delete upload tmp folder in local server';

      await this.fileService.deleteFolder(folder);
    } else {
      folder = this.configService.get('aws.s3.tmpFolder');
      message = 'Job delete upload tmp folder in aws/s3 server';

      await this.s3Service.deleteFolder(folder);
    }

    this.logger.info(message, `Time Complete: ${date}`);
  }
}
