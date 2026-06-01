import UserService from "./user.service";
import { NextFunction, Request, Response } from "express";
export declare class UserController {
    private readonly service;
    constructor(service: UserService);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    currentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.controller.d.ts.map