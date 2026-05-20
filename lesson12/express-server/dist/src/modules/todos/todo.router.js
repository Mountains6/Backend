"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoRouter = createTodoRouter;
const express_1 = require("express");
function createTodoRouter(controller) {
    const router = (0, express_1.Router)();
    router.get("/", controller.getAll);
    router.post("/", controller.create);
    return router;
}
//# sourceMappingURL=todo.router.js.map