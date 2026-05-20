import { Router } from "express";
import { TodoController } from "./todo.controller";

// Здесь только маршрутизация

export function createTodoRouter(controller: TodoController): Router {
  const router = Router();
  router.get("/", controller.getAll);
  router.post("/", controller.create);
  
  return router;
}
