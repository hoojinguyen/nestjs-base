import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './services';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('mail'),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
