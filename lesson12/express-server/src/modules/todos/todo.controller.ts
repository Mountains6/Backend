import { NextFunction, Request, Response } from "express";
import { TodoService } from "./todo.service";
import { CreateTodoDto, createTodoDto } from "./todo.request.dto";

export class TodoController {
  constructor(private readonly service: TodoService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const todos = await this.service.getAll();
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateTodoDto = createTodoDto.parse(req.body);
      const todo = await this.service.create(data);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };
}
