import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetPasswordController } from './controllers';
import { UsersModule } from '@v1/users/users.module';
import { ResetPasswordService } from './services';
import { JwtResetStrategy } from './strategies';
import { MailModule } from '@/src/mail/mail.module';

@Module({
  controllers: [ResetPasswordController],
  imports: [
    PassportModule,
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessTokenExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ResetPasswordService, JwtResetStrategy],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
