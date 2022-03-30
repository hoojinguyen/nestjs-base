import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService, TokenService } from '@/src/utils/services';
import { CreateUserDto } from '@v1/users/dtos/create-user.dto';
import { User } from '@v1/users/entities/user.entity';
import { UsersService } from '@v1/users/services';
import { ExceptionsResponse } from '../exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {
    // empty
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ email: email });

    if (user && this.passwordService.comparePassword(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException(
      ExceptionsResponse.incorrectEmailOrPassword,
    );
  }

  public async register(dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  public async login(user: User) {
    const accessToken = this.tokenService.generateAccessToken(user);
    const token = await this.tokenService.createRefreshToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(token);

    return { accessToken, refreshToken };
  }
}
