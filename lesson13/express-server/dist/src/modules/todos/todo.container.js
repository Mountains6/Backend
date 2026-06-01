"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTodoRouter = buildTodoRouter;
const todo_service_1 = require("./todo.service");
const todo_controller_1 = require("./todo.controller");
const todo_router_1 = require("./todo.router");
const todo_repository_1 = require("./todo.repository");
function buildTodoRouter() {
    const repo = new todo_repository_1.DrizzleRepository;
    const service = new todo_service_1.TodoService(repo);
    const controller = new todo_controller_1.TodoController(service);
    return (0, todo_router_1.createTodoRouter)(controller);
}
//# sourceMappingURL=todo.container.js.map