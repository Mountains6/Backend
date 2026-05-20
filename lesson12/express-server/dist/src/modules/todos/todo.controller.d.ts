import { NextFunction, Request, Response } from "express";
import { TodoService } from "./todo.service";
export declare class TodoController {
    private readonly service;
    constructor(service: TodoService);
    getAll: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=todo.controller.d.ts.map