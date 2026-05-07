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

// POST /post
router.post("/", (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).json({ error: "Bad request" });
  }

  const post = { id: v7(), title, text };
  posts.push(post);
  res.status(201).json(post);
});

export default router;
