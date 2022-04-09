import { TokenService } from '@/src/utils/services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './../../users/services/users.service';

@Injectable()
export class JwtResetStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.params?.resetToken,
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const decodedToken: any = jwt.decode(jwtToken);
        const user = await this.usersService.findOneOrFail({
          id: decodedToken.id,
        });
        done(null, user.password);
      },
    });
  }

  public async validate(payload: any) {
    const token = await this.tokenService.findOneOrFail({ id: payload.id });
    return await this.usersService.findOneOrFail({ id: token.userId });
  }
}
