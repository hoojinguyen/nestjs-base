import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenService } from '@/src/utils/services';
import { UsersService } from '@v1/users/services';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshTokenSecret'),
    });
  }

  public async validate(payload: any) {
    const token = await this.tokenService.findOneOrFail({ id: payload.id });
    return await this.usersService.findOneOrFail({ id: token.userId });
  }
}
