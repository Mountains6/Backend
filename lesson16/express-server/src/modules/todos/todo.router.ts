import { Router } from "express";
import { TodoController } from "./todo.controllers";
import { UserRepository } from "../users/user.entity";
import { createCurrentUserMiddleware } from "../../middleware/current-user.middleware";

// Здесь только маршрутизация

export function createTodoRouter(controller: TodoController, userRepo: UserRepository,
): Router {
  const router = Router();
  router.use(createCurrentUserMiddleware(userRepo));


  router.get("/", controller.getAll);
  router.post("/", controller.create);
  router.get("/:id", controller.getOne);
  router.delete("/:id", controller.delete);
  router.patch("/:id", controller.update)

  return router;
}
