import { Router } from "express";
import { DrizzleUserRepository } from "./user.repository";
import UserService from "./user.service";
import { UserController } from "./user.controller";
import { createUserRouter } from "./user.router";

export function buildUserRouter(): Router {
  const repo = new DrizzleUserRepository();
  const service = new UserService(repo);
  const controller = new UserController(service);

return createUserRouter(controller, repo);
}
