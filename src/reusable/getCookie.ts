import { Request } from "express";


declare module 'express' {
  interface Request {
    cookies: {
      [name: string]: string;
    };
  }
}
const getCookie = (req: Request) => {
    return req.cookies['accessToken'];
  };

export default getCookie