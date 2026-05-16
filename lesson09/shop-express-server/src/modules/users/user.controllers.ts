import { UserService } from "./user.service";
import { Request, Response } from "express";

export class UserController {
  constructor(private readonly service: UserService) {
    this.service = service;
  }

  getAll = async (_req: Request, res: Response) => {
    const users = await this.service.getAll();
    res.status(200).json(users);
  };

  create = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "Bad request" });
    }
    try {
      const user = await this.service.create(name, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  };
}
