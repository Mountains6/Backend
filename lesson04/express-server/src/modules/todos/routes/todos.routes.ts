import { Router } from "express";
import { v7 } from "uuid";
import { Todo } from "../todos.types";

const router = Router();

const todos: Todo[] = [
  {
    id: v7(),
    title: "Learn express",
    content: "Build a REST API",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: v7(),
    title: "Learn Nest",
    content: "Build a Nest app",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

// GET /todos - Получение всего списка дел
router.get("/", (_req, res) => {
  res.status(200).json(todos);
});

// GET /todos/:id - Получение определенного пункта элемента списка дел по id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  res.status(200).json(todo);
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newTodo: Todo = {
    id: v7(),
    title,
    content,
    status: "pending", // по умолчанию
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json({ message: "New Todo item is created", id: newTodo.id });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ error: `Todo with id ${id} not found` });
    throw new Error("Not found");
  }

  const { title, content } = req.body;

  if (!title && !content) {
    res.status(400).json({ error: "Bad request. No title or content" });
  }

  if (title) {
    todo.title = title;
  }

  if (content) {
    todo.content = content;
  }

  res.status(200).json(todo);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ error: `Todo with id ${id} not found` });
    throw new Error("Not found");
  }

  const indexOfTodo = todos.findIndex((todo) => todo.id === id);
  todos.splice(indexOfTodo, 1);

  res.status(200).json(todo);
});

export default router;
