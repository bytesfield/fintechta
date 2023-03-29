import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('AppError');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      status = 400;
    }

    if (exception instanceof ForbiddenException) {
      status = 401;
    }

    this.logger.error(exception);

    const responseMessage = (type: string, message: any) => {
      response.status(status).json({
        status: 'failed',
        statusCode: status,
        path: request.url,
        type: type,
        message: message,
      });
    };

    if (exception instanceof BadRequestException) {
      const errors = (exception.getResponse() as any)?.message;
      return responseMessage('ValidationError', { errors });
    }

    const newException = exception as any;

    if (newException.message.error) {
      responseMessage('Error', newException.message.error);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
