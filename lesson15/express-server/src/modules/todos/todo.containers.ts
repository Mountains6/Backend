// writing - соединим все наши независимые слои

import { Router } from "express";
import { DrizzleRepository } from "./todo.repository";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controllers";
import { createTodoRouter } from "./todo.router";
import { DrizzleUserRepository } from "../users/user.repository";

export function buildTodoRouter(): Router {
  // const repo = new InMemoryRepository();
  const repo = new DrizzleRepository();
  const service = new TodoService(repo);
  const controller = new TodoController(service);

  const userRepo = new DrizzleUserRepository();

  return createTodoRouter(controller, userRepo);
}
