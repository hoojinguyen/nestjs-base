import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
  password: process.env.CACHE_PASSWORD,
  ttl: process.env.CACHE_TTL,
}));
