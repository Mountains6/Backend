import { Request, Response, NextFunction } from "express";

export const customLogger = (req: Request, _res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.url;
  console.log(`${method} - ${url}`);

  next();
};