"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const todo_request_dto_1 = require("./todo.request.dto");
class TodoController {
    constructor(service) {
        this.service = service;
        this.getAll = async (_req, res, next) => {
            try {
                const todos = await this.service.getAll();
                res.status(200).json(todos);
            }
            catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const data = todo_request_dto_1.createTodoDto.parse(req.body);
                const todo = await this.service.create(data);
                res.status(201).json(todo);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.TodoController = TodoController;
//# sourceMappingURL=todo.controller.js.map