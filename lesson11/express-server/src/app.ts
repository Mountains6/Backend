import express, { Request, Response, NextFunction } from "express";
import { pinoHttp } from "pino-http";

import postsRouter from "./modules/posts/routes/posts.routes";
import { buildTodoRouter } from "./modules/todos/todo.container";
import { customLogger } from "./middleware/custom-logger";
import { logger } from "./lib/logger";
import { privateGuard } from "./middleware/private-guard";
import { buildUserRouter } from "./modules/users/user.container";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

// Вызов middleware для каждого запроса
app.use(customLogger);

// Подключение логгера из библиотеки pino
app.use(pinoHttp({ logger }));

app.get("/health", customLogger, (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/private", privateGuard, (_req, res) => {
  res
    .status(200)
    .json({ message: "This is private information. You have access" });
});

app.use("/posts", postsRouter);
app.use("/todos", buildTodoRouter());
app.use("/users", buildUserRouter());

// errorHandler должен быть в самом конце!
app.use(errorHandler)

export default app;
