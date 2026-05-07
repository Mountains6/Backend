import { Router } from "express";
import { v7 } from "uuid";
import { Todo } from "../todos.types";

const router = Router();

const todos: Todo[] = [
  {
    id: v7(),
    title: "Example Todo",
    content: "This is a sample task",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

router.get("/", (_req, res) => {
  res.status(200).json(todos);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  res.status(200).json(todo);
});

router.post("/", (req, res) => {
  const { title, content, status } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newTodo: Todo = {
    id: v7(),
    title,
    content,
    status: status,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

export default router;
