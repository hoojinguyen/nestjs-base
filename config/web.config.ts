import { registerAs } from '@nestjs/config';

export default registerAs('web', () => ({
  webUrl: process.env.WEB_URL,
  port: process.env.PORT,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
}));
