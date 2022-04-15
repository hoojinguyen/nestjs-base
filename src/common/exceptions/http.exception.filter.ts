import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { WinstonProvider } from '@utils/providers';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new WinstonProvider();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();

    const module = responseBody?.module || request?.route?.path;
    const statusName =
      responseBody?.statusName || responseBody?.error || 'Error';
    const message = Array.isArray(responseBody?.message)
      ? responseBody?.message
      : [responseBody?.message];

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
