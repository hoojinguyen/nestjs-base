import { WinstonProvider } from '@/src/utils/providers';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import * as isEmptyObject from 'is-empty-obj';
import * as moment from 'moment';

@Injectable()
export class HealthService {
  constructor(
    private readonly logger: WinstonProvider,
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkSystem() {
    const result: any = await this.healthCheckService.check([
      () =>
        this.typeOrmHealthIndicator.pingCheck('database', {
          timeout: 1000,
        }),
      () =>
        this.diskHealthIndicator.checkStorage('disk', {
          thresholdPercent: 0.9,
          path: '/',
        }),
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);

    const { error, details } = result;
    const date = moment().format('dddd, YYYY/MM/DD, HH:mm:ss A');
    const message = `The system health check job is completed at ${date}`;

    if (isEmptyObject(error)) {
      this.logger.info(message, details);
    } else {
      this.logger.error(error, message);
    }

    return result;
  }
}
