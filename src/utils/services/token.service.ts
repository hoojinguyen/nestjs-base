import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '@v1/auth/entities';
import { User } from '@v1/users/entities';
import { instanceToPlain } from 'class-transformer';
import * as ms from 'ms';
import { Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { CreateRefreshTokenDto } from '../dtos';
import { ExceptionsResponse } from '../exceptions';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // empty
  }

  public async findOne(
    options: FindConditions<RefreshToken>,
  ): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne(options);
  }

  public async findOneOrFail(
    options: FindConditions<RefreshToken>,
  ): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOne(options);

    if (!token) {
      throw new NotFoundException(ExceptionsResponse.refreshTokenNotFound);
    }

    if (token.isRevoked) {
      throw new MethodNotAllowedException(
        ExceptionsResponse.refreshTokenRevoked,
      );
    }

    return token;
  }

  public async createRefreshToken(user: User): Promise<RefreshToken> {
    const expiresIn = ms(
      this.configService.get<string>('token.refreshTokenExpiresIn'),
    );

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + expiresIn);

    const refreshTokenDto = new CreateRefreshTokenDto({
      userId: user.id,
      isRevoked: false,
      expires: expiration,
    });

    return await this.refreshTokenRepository.save(refreshTokenDto);
  }

  public generateAccessToken(user: User) {
    return this.jwtService.sign(instanceToPlain(user));
  }

  public generateRefreshToken(token: RefreshToken) {
    const options = {
      expiresIn: this.configService.get<string>('token.refreshTokenExpiresIn'),
      secret: this.configService.get<string>('token.refreshTokenSecret'),
    };

    return this.jwtService.sign({ ...token }, options);
  }

  public generateResetPasswordToken(user: User) {
    const options = {
      expiresIn: this.configService.get<string>(
        'token.resetPasswordTokenExpiresIn',
      ),
      secret: user.password,
    };

    return this.jwtService.sign(instanceToPlain(user), options);
  }
}
