import { Request, Response, NextFunction } from "express";

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers.xapikey;
  
  if (apiKey !== "12345") {
    return res.status(401).json("401 Unauthorized");
  }

  return  next();
}
