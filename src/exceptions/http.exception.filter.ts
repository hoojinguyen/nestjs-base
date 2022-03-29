import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();

    const body = {
      message: Array.isArray(responseBody?.message)
        ? responseBody?.message
        : [responseBody?.message],
      statusName: responseBody?.statusName || responseBody?.error || 'Error',
      module: responseBody?.module || request?.route?.path,
    };

    response.status(status).json(body);
  }
}
