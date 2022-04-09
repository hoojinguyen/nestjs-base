import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@v1/users/entities';
import * as ms from 'ms';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // empty
  }

  async sendUserResetPassword(user: User) {
    const webUrl = this.configService.get<string>('web.webUrl');
    const url = `${webUrl}/api/v1/reset-password/${user.resetToken}`;

    let expiresIn = this.configService.get<string>(
      'jwt.resetPasswordTokenExpiresIn',
    );
    expiresIn = ms(ms(expiresIn), { long: true });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: 'reset-password.hbs',
      context: {
        url,
        expiresIn,
      },
    });
  }
}
