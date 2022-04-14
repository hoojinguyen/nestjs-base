import { CacheModuleOptions } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { StoreConfig } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export default registerAs(
  'cache',
  (): CacheModuleOptions<StoreConfig> => ({
    store: redisStore,
    host: process.env.CACHE_HOST,
    port: +process.env.CACHE_PORT,
    ttl: +process.env.CACHE_TTL,
  }),
);
