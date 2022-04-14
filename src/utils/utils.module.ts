import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@v1/auth/entities';
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
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('cache'),
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
