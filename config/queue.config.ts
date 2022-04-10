import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  host: process.env.QUEUE_HOST,
  port: process.env.QUEUE_PORT,
}));
