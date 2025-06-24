import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import ApiError from '../errors/api.error';

export default function validateBody<T extends yup.AnyObjectSchema>(schema: T): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        throw ApiError.BadRequest('Invalid body', err.errors)
      }
      next(err);
    }
  };
}