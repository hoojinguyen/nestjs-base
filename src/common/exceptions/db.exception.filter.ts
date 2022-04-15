import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { WinstonProvider } from '@utils/providers';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
  private logger = new WinstonProvider();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = new InternalServerErrorException().getStatus();

    const message = `${exception.message}. SQL: ${exception.sql}`;
    const module = request.route.path;
    const statusName = exception.code;

    const body: any = {
      message,
      statusName,
      module,
      timestamp: new Date().toISOString(),
      path: request.path,
    };

    this.logger.error(body, message, { module, statusName });

    response.status(status).json(body);
  }
}
