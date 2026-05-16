import { Router } from "express";
import { UserService } from "./user.service";
import { UserController } from "./user.controllers";
import { createUserRouter } from "./user.router";
import { DrizzleRepository } from "./user.repository";

export function buildUserRouter(): Router {
  const repo = new DrizzleRepository();
  const service = new UserService(repo);
  const controller = new UserController(service);

  return createUserRouter(controller);
}
