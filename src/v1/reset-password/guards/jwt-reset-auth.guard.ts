import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtResetAuthGuard extends AuthGuard('jwt-reset') {}
