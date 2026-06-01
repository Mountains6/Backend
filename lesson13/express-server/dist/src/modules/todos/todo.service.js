"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const todo_mapper_1 = __importDefault(require("./todo.mapper"));
class TodoService {
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        const todos = await this.repo.findAll();
        return todos.map(todo_mapper_1.default);
    }
    async create(dto) {
        const todo = await this.repo.create(dto.title);
        return (0, todo_mapper_1.default)(todo);
    }
}
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map