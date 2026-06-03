import { Router } from "express";
import { Post } from "../posts.types";
import { v7 } from "uuid";

const router = Router();

const posts: Post[] = [
  { id: v7(), title: "Cloudy weather", text: "It is dark again" },
  { id: v7(), title: "Job", text: "I got new job" },
];

// GET /posts
router.get("/", (_req, res) => {
  res.status(200).json(posts);
});

router.get("/:id", (req, res) => {
  // path param
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);

  if (!post) {
    res.status(404).json({ error: `Post with id ${id} not found` });
  }

  res.status(200).json(post);
});

// POST /posts
router.post("/", (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).json({ error: "Bad request" });
  }

  const post = { id: v7(), title, text };
  posts.push(post);
  res.status(201).json(post);
});

// PATCH /posts/:id - Редактирование поста
router.patch("/:id", (req, res) => {
  const { id } = req.params;

  const post = posts.find((post) => post.id === id);

  if (!post) {
    res.status(404).json({ error: `Post with id ${id} not found` });
    throw new Error("Not found");
  }

  const { title, text } = req.body;

  if (!title && !text) {
    res.status(400).json({ error: "Bad request. No title or text" });
  }

  if (title) {
    post.title = title;
  }

  if (text) {
    post.text = text;
  }

  res.status(200).json(post);
});

// DELETE /posts/:id - Удаление поста
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const post = posts.find((post) => post.id === id);

  if (!post) {
    res.status(404).json({ error: `Post with id ${id} not found` });
    throw new Error("Not found");
  }

  // Ищем индекс поста
  const indexOfPost = posts.findIndex((post) => post.id === id);
  posts.splice(indexOfPost, 1);

  res.status(200).json(post);
});

export default router;
