"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = toTodoResponse;
function toTodoResponse(todo) {
    return {
        id: todo.id,
        title: todo.title,
        done: todo.done,
        createdAt: todo.createdAt.toISOString(),
    };
}
//# sourceMappingURL=todo.mapper.js.map