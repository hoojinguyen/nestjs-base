import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT,
  host: process.env.APP_HOST,
  protocol: process.env.APP_PROTOCOL,
  name: process.env.APP_NAME,
  version: process.env.APP_VERSION,
  routePrefix: process.env.APP_ROUTE_PREFIX,
}));
