import { Router } from "express";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { createTodoRouter } from "./todo.router";
import { DrizzleRepository } from "./todo.repository";

export function buildTodoRouter(): Router{
    const repo = new DrizzleRepository
    const service = new TodoService(repo);
    const controller = new TodoController(service);
    
    return createTodoRouter(controller);
}