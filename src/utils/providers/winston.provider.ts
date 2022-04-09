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
    const timestamp = info.timestamp;
    const level = info.level.toLocaleUpperCase();
    const message = info.message;

    return (
      `[Winston] ` +
      `${pid} ` +
      ' - ' +
      `${timestamp} ` +
      ' - ' +
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
        format.splat(),
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
