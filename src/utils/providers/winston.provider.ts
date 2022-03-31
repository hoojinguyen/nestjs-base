import { Injectable, LoggerService } from '@nestjs/common';
import { resolve } from 'path';
import {
  createLogger,
  format,
  Logform,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFile } from 'winston/lib/winston/transports';

@Injectable()
export class WinstonProvider implements LoggerService {
  private readonly instance: Logger;

  constructor() {
    this.instance = createLogger(this.initOptions());
  }

  // 格式化输出样式
  private format(info: Logform.TransformableInfo): string {
    const pid = process.pid;
    const env = process.env.NODE_ENV || 'DEV';
    const name = process.env.APP_NAME || 'Nest-Server';
    const version = process.env.APP_VERSION || 'v1';
    const timestamp = info.timestamp;
    const level = info.level.toLocaleUpperCase();

    let message = info.message;

    if (typeof JSON.parse(message) === 'object') {
      const parseMes = JSON.parse(message);
      const { type, trace, error, meta, name } = parseMes;
      if (type === 'ERROR') {
        message = `${type} - [${trace}] - ${name}: ${error}`;
      } else {
        message = `${type} - [${meta}] - ${trace}`;
      }
    }

    const upper = (value: string) => value.toLocaleUpperCase();
    return (
      `[${upper(version)}/${upper(name)}] ` +
      `${pid}` +
      ' - ' +
      `${timestamp} ` +
      `[${env}] ` +
      `${level}: ` +
      `${message}`
    );
  }

  private initOptions(): LoggerOptions {
    const dirname = `${resolve(__dirname, '../../')}/logs`;

    const consoleLogger = new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss A' }),
        format.printf((message) => this.format(message)),
        format.colorize({ all: true }),
      ),
    });

    // const stdoutLogger = new DailyRotateFile({
    //   dirname,
    //   level: 'info',
    //   filename: '%DATE%-stdout.log',
    //   datePattern: `YYYY-MM-DD`,
    //   zippedArchive: true,
    //   maxSize: '5m',
    //   maxFiles: '10d',
    //   format: format.combine(
    //     format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss A' }),
    //     format.printf((message) => this.format(message)),
    //   ),
    // });

    const stderrLogger = new DailyRotateFile({
      dirname,
      level: 'error',
      filename: '%DATE%-stderr.log',
      datePattern: `YYYY-MM-DD`,
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '10d',
      format: format.combine(
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss A' }),
        format.printf((message) => this.format(message)),
      ),
    });

    return {
      exitOnError: false,
      handleExceptions: true,
      exceptionHandlers: stderrLogger,
      transports: [consoleLogger, stderrLogger],
    };
  }

  public log(trace: string, meta?: any) {
    const data = meta ? { trace, meta, type: 'LOG' } : trace;
    this.instance.info(JSON.stringify(data));
  }

  public info(trace: string, meta?: any) {
    const data = meta ? { trace, meta, type: 'INFO' } : trace;
    this.instance.info(JSON.stringify(data));
  }

  public warn(trace: string, meta?: any) {
    const data = meta ? { trace, meta, type: 'WARN' } : trace;
    this.instance.warn(JSON.stringify(data));
  }

  public error(error: Error, trace: string, meta?: any) {
    const exception = {
      error: error.message,
      stack: error.stack,
      name: error.name,
      type: 'ERROR',
      trace,
    };

    const data = meta ? { meta, ...exception } : exception;
    this.instance.error(JSON.stringify(data));
  }
}
