import { v4 } from "uuid";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    request_id?: string;
  }
}

export const xRequestId = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["x-request-id"]) {
    res.setHeader("x-request-id", req.headers["x-request-id"] as string);
    req.request_id = req.headers["x-request-id"] as string;
  } else {
    const uuid = v4();
    res.setHeader("x-request-id", uuid);
    req.request_id = uuid;
  }
  next();
};
