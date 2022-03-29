import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbExceptionFilter, HttpExceptionFilter } from '@exceptions';

import { APP_FILTER } from '@nestjs/core';
import { AppV1Module } from './v1/app-v1.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from './utils/utils.module';
import databaseConfig from '@/config/database.config';
import jwtConfig from '@/config/jwt.config';
import mailConfig from '@/config/mail.config';
import webConfig from '@/config/web.config';

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
