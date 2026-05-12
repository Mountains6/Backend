import { TodoService } from "./todo.service";
import { Request, Response } from "express";

// Adapter layer - http requests -> use case
// req, res, express, status code, error

export class TodoController {
  constructor(private readonly service: TodoService) {
    this.service = service;
  }

  async getAll(_req: Request, res: Response) {
    const todos = await this.service.getAll();
    res.status(200).json(todos);
  }

  async create(req: Request, res: Response) {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Bad request" });
    }
    try {
      const todo = await this.service.create(title);
      res.status(201).json(todo);
    } catch (error) {
      if (error instanceof Error) {
        res.send(400).json({ error: error.message });
      }
    }
  }
}
