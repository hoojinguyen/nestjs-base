import databaseConfig from '@/config/database.config';
import jwtConfig from '@/config/jwt.config';
import mailConfig from '@/config/mail.config';
import webConfig from '@/config/web.config';
import { DbExceptionFilter, HttpExceptionFilter } from '@exceptions';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from './utils/utils.module';
import { AppV1Module } from './v1/app-v1.module';

@Module({
  imports: [
    AppV1Module,
    UtilsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwtConfig, databaseConfig, mailConfig, webConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: DbExceptionFilter },
  ],
})
export class AppModule {
  // empty
}
