import { TokenService } from '@/src/utils/services';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@v1/users/dtos';
import { JwtRefreshAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {
    // empty
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public login(@Req() request) {
    const payload = request.user;
    return this.authService.login(payload);
  }

  @Post('register')
  // @UseGuards(LocalAuthGuard)
  public register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  public refresh(@Req() request) {
    const payload = request.user;
    return {
      accessToken: this.tokenService.generateAccessToken(payload),
    };
  }
}
