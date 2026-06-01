"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pino_http_1 = require("pino-http");
require("./types/express");
const posts_routes_1 = __importDefault(require("./modules/posts/routes/posts.routes"));
const todo_container_1 = require("./modules/todos/todo.container");
const custom_logger_1 = require("./middleware/custom-logger");
const logger_1 = require("./lib/logger");
const private_guard_1 = require("./middleware/private-guard");
const user_container_1 = require("./modules/users/user.container");
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Вызов middleware для каждого запроса
app.use(custom_logger_1.customLogger);
// Подключение логгера из библиотеки pino
app.use((0, pino_http_1.pinoHttp)({ logger: logger_1.logger }));
app.get("/helth", custom_logger_1.customLogger, (_req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/private", private_guard_1.privateGuard, (_req, res) => {
    res
        .status(200)
        .json({ message: "This is private information. You have access" });
});
app.use("/posts", posts_routes_1.default);
app.use("/todos", (0, todo_container_1.buildTodoRouter)());
app.use("/users", (0, user_container_1.buildUserRouter)());
// errorHandler должен быть в самом конце!
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map