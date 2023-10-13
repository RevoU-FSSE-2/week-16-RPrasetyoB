import { Request, Response, NextFunction } from 'express';
import ErrorCatch from '../reusable/errorCatch';

function errorHandler(
  error: ErrorCatch,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'An error occurred';
  const success = error.success || false;

  res.status(status).json({ success, message });
}

export default errorHandler;