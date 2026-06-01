"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoDto = void 0;
const zod_1 = require("zod");
exports.createTodoDto = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title is required"),
});
//# sourceMappingURL=todo.request.dto.js.map