import { Response } from 'express';

export class ResponseHandler {
  static success(res: Response, message: string, data?: any) {
    res.status(200).json(this.createResponseObject('success', message, data));
  }

  static error(res: Response, message: string, status = 500) {
    res.status(status).json({
      status: 'failed',
      message,
    });
  }

  private static createResponseObject(
    status = 'success',
    message = '',
    data: object,
  ) {
    return {
      status,
      message,
      data,
    };
  }
}
