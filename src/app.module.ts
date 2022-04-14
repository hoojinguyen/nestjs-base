import awsConfig from '@/config/aws.config';
import appConfig from '@config/app.config';
import cacheConfig from '@config/cache.config';
import databaseConfig from '@config/database.config';
import fileConfig from '@config/file.config';
import jwtConfig from '@config/jwt.config';
import mailConfig from '@config/mail.config';
import queueConfig from '@config/queue.config';
import webConfig from '@config/web.config';
import { DbExceptionFilter, HttpExceptionFilter } from '@exceptions';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { UtilsModule } from './utils/utils.module';
import { AppV1Module } from './v1/app-v1.module';

@Module({
  imports: [
    AppV1Module,
    UtilsModule,
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        jwtConfig,
        databaseConfig,
        mailConfig,
        webConfig,
        cacheConfig,
        queueConfig,
        fileConfig,
        awsConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('queue.host'),
          port: +configService.get<string>('queue.port'),
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: configService.get<string>('file.path'),
          exclude: configService.get<string[]>('file.exclude'),
        },
      ],
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
