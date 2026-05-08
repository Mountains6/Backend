import express from "express";
import postsRouter from "./modules/posts/routes/posts.routes";
import todoRouter from "./modules/todos/routes/todos.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/posts", postsRouter);
app.use("/todos", todoRouter);

export default app;