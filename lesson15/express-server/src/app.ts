import "./types/express";
import express, { Request, Response, NextFunction } from "express";
import { pinoHttp } from "pino-http";
import cookieParser from "cookie-parser";

import postsRouter from "./modules/posts/routes/posts.routes";
import { buildTodoRouter } from "./modules/todos/todo.containers";
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

app.get("/helth", customLogger, (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/private", privateGuard, (_req, res) => {
  res
    .status(200)
    .json({ message: "This is private information. You are have access" });
});

app.use("/posts", postsRouter);
app.use("/todos", buildTodoRouter());
app.use("/users", buildUserRouter());

// How to set cookie to the frontend
app.post("/collect", (req, res) => {
  const { email } = req.body;

  res.cookie("user_email", email, {
    path: "/user-info",
    httpOnly: true,
    maxAge: 1000 * 60 * 60, //1 hour
  });

  res.status(200).json({ message: "Cookie has been set" });
});

// How to read cookie
app.get("/user-info", (req, res)=>{
  const userInfo = req.cookies.user_email;
  res.status(200).json({userInfo})
})

// How to delete cookie
app.delete("/user-info", (_req, res) => {
  res.cookie("user_email", "", {
    path: "/user-info",
    httpOnly: true,
    maxAge: 0,
  });
  res.status(200).json({ message: "Cookies deleted" });
});

// errorHandler должен быть в самом конце!
app.use(errorHandler);

export default app;
