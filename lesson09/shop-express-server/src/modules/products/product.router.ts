import { Router } from "express";
import { ProductController } from "./product.controllers";

export function createProductRouter(controller: ProductController): Router {
  const router = Router();
  router.get("/", controller.getAll);
  router.post("/", controller.create);

  return router;
}
