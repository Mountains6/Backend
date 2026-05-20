import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "../lib/jwt";
import { UserRepository } from "../modules/users/user.entity";
import toUserResponse from "../modules/users/user.mapper";

type AccessTokenPayload = JwtPayload & {
  userId?: string;
};

export const createCurrentUserMiddleware =
  (repo: UserRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Bearer token required" });
    }

    try {
      const payload = verifyToken(token);
      const userId =
        typeof payload === "string"
          ? undefined
          : (payload as AccessTokenPayload).userId;

      if (typeof userId !== "string") {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const user = await repo.findById(userId);

      if (!user) {
        return res.status(401).json({ error: "User from token not found" });
      }

      req.currentUser = toUserResponse(user);
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
