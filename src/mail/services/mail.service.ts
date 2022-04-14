import { WinstonProvider } from '@/src/utils/providers';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@v1/users/entities';
import { Job } from 'bull';
import * as ms from 'ms';

@Injectable()
@Processor('mail')
export class MailService {
  constructor(
    private readonly logger: WinstonProvider,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // empty
  }

  @OnQueueActive()
  onActive(job: Job) {
    const info = {
      pid: job.id,
      queue: job.queue.name,
      action: job.name,
      data: job.data,
    };

    this.logger.info('JOB IS PROCESSING: ', info);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    const info = {
      pid: job.id,
      queue: job.queue.name,
      action: job.name,
    };

    this.logger.info('JOB IS COMPLETED: ', info);
  }

  @Process('reset-password')
  async sendUserResetPassword(job: Job<User>) {
    const user = job.data;

    const { webUrl } = this.configService.get('app');
    const { resetPasswordTokenExpiresIn } = this.configService.get('token');

    const url = `${webUrl}/api/v1/reset-password/${user.resetToken}`;
    const expiresIn = ms(ms(resetPasswordTokenExpiresIn), { long: true });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: 'reset-password.hbs',
      context: {
        url,
        expiresIn,
      },
    });
  }
}
