import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    name: 'default',
    type: process.env.DB_CONNECTION as any,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity{ .ts,.js}'],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: ['database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_history',
    migrationsRun: true,
    logging: false,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    cache: {
      type: (process.env.CACHE_DB_TYPE as any) || 'redis',
      duration: +process.env.CACHE_DB_DURATION || 5000, // 5s
      options: {
        host: process.env.CACHE_DB_HOST || 'local',
        port: +process.env.CACHE_DB_PORT || 6379,
      },
      ignoreErrors: true,
    },
    // replication: {
    //   master: {
    //     host: process.env.DB_MASTER_HOST,
    //     port: +process.env.DB_MASTER_PORT,
    //     username: process.env.DB_MASTER_USERNAME,
    //     password: process.env.DB_MASTER_PASSWORD,
    //     database: process.env.DB_MASTER_DATABASE,
    //   },
    //   slaves: [
    //     {
    //       host: process.env.DB_SLAVE_HOST,
    //       port: +process.env.DB_SLAVE_PORT,
    //       username: process.env.DB_SLAVE_USERNAME,
    //       password: process.env.DB_SLAVE_PASSWORD,
    //       database: process.env.DB_SLAVE_DATABASE,
    //     },
    //   ],
    // },
  }),
);
