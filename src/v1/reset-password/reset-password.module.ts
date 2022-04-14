import { MailModule } from '@/src/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@v1/users/users.module';
import { ResetPasswordController } from './controllers';
import { ResetPasswordService } from './services';
import { JwtResetStrategy } from './strategies';

@Module({
  controllers: [ResetPasswordController],
  imports: [
    PassportModule,
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({ name: 'mail' }),
  ],
  providers: [ResetPasswordService, JwtResetStrategy],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
