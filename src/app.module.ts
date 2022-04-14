import awsConfig from '@/config/aws.config';
import serverStaticConfig from '@/config/server-static.config';
import tokenConfig from '@/config/token.config';
import appConfig from '@config/app.config';
import cacheConfig from '@config/cache.config';
import databaseConfig from '@config/database.config';
import fileConfig from '@config/file.config';
import jwtConfig from '@config/jwt.config';
import mailConfig from '@config/mail.config';
import queueConfig from '@config/queue.config';
import { DbExceptionFilter, HttpExceptionFilter } from '@exceptions';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';
import { UtilsModule } from './utils/utils.module';
import { AppV1Module } from './v1/app-v1.module';

@Module({
  imports: [
    AppV1Module,
    UtilsModule,
    UploadModule,
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        jwtConfig,
        tokenConfig,
        databaseConfig,
        mailConfig,
        cacheConfig,
        queueConfig,
        serverStaticConfig,
        fileConfig,
        awsConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('queue'),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('server-static'),
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
