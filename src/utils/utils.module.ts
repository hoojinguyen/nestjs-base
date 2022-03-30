import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@v1/auth/entities';
import { PasswordService, TokenService } from './services';
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
  ],
  providers: [PasswordService, TokenService, IsExistConstraint],
  exports: [PasswordService, TokenService, HttpModule],
})
export class UtilsModule {}
