import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@v1/auth/entities';
import * as redisStore from 'cache-manager-redis-store';
import { WinstonProvider } from './providers';
import {
  CacheService,
  FileService,
  PasswordService,
  S3Service,
  TokenService,
} from './services';
// -----------------------------------------------------------------------------------------------------
// Validate decorators uses dependency injection MUST BE ADDED TO providers
// -----------------------------------------------------------------------------------------------------
import { IsExistConstraint } from './validate-decorators';

@Global()
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([RefreshToken]),
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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('cache.host'),
        port: configService.get<string>('cache.port'),
        ttl: configService.get<number>('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    PasswordService,
    TokenService,
    CacheService,
    FileService,
    S3Service,
    IsExistConstraint,
    WinstonProvider,
  ],
  exports: [
    PasswordService,
    TokenService,
    CacheService,
    FileService,
    S3Service,
    HttpModule,
    WinstonProvider,
  ],
})
export class UtilsModule {}
