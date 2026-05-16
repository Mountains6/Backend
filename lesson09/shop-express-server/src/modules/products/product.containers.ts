import { Router } from "express";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controllers";
import { createProductRouter } from "./product.router";
import { DrizzleRepository } from "./product.repository";

export function buildProductRouter(): Router {
  const repo = new DrizzleRepository();
  const service = new ProductService(repo);
  const controller = new ProductController(service);

  return createProductRouter(controller);
}
