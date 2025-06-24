import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/api.error';

export default (
  err: Error | ApiError,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  res.status(500).json({ message: 'Неизвестная ошибка' });
};
