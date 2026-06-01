import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../modules/users/user.entity";
export declare const createCurrentUserMiddleware: (repo: UserRepository) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=current-user.middleware.d.ts.map