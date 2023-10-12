import { Response } from "express";

const errorHandlerMiddleware = (
  err: Error | any,
  res: Response
) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    errors: err.errors,
  });
};

export default errorHandlerMiddleware;