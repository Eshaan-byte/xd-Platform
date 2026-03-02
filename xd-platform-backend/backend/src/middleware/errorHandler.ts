import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { createModuleLogger } from '../config/logger.js';
import { ApiResponseHelper } from '../types/api.js';
import { env } from '../config/env.js';

const logger = createModuleLogger('ErrorHandler');

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    },
    'Error occurred'
  );

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json(
      ApiResponseHelper.error('Validation Error', undefined, validationErrors)
    );
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const validationErrors = Object.keys(error.errors).map((key) => ({
      field: key,
      message: error.errors[key].message,
    }));

    res.status(400).json(
      ApiResponseHelper.error(
        'Validation Error',
        'Invalid data provided',
        validationErrors
      )
    );
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json(
      ApiResponseHelper.error('Invalid ID', 'The provided ID is not valid')
    );
    return;
  }

  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0];
    res.status(400).json(
      ApiResponseHelper.error(
        'Duplicate Entry',
        `${field} already exists`
      )
    );
    return;
  }

  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json(
    ApiResponseHelper.error(
      message,
      env.NODE_ENV === 'development' ? error.stack : undefined
    )
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json(
    ApiResponseHelper.error('Not Found', `Cannot ${req.method} ${req.path}`)
  );
};
