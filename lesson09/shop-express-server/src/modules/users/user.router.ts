import { Router } from "express";
import { UserController } from "./user.controllers";

export function createUserRouter(controller: UserController): Router {
  const router = Router();
  router.get("/", controller.getAll);
  router.post("/", controller.create);

  return router;
}
