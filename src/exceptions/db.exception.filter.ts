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
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = new InternalServerErrorException().getStatus();

    const responseBody: any = {
      message: `${exception.message}. SQL: ${exception.sql}`,
      statusName: exception.code,
      module: request.route.path,
    };

    response.status(status).json(responseBody);
  }
}
