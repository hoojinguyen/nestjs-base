import { registerAs } from '@nestjs/config';
import { QueueOptions } from 'bull';

export default registerAs(
  'queue',
  (): QueueOptions => ({
    redis: {
      host: process.env.QUEUE_HOST,
      port: +process.env.QUEUE_PORT,
    },
  }),
);
