import { WinstonProvider } from '@/src/utils/providers';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
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

    const responseBody: any = { message, statusName, module };

    this.logger.error(responseBody, message, { module, statusName });

    response.status(status).json(responseBody);
  }
}
