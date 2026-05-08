import { Router } from "express";
import { v7 } from "uuid";
import { User } from "../users.types";

const router = Router();

const users: User[] = [
  {
    id: v7(),
    name: "Bob",
    email: "bob@gmail.com",
    password: "12345",
    role: "user",
    createdAt: new Date().toISOString(),
  },
  {
    id: v7(),
    name: "Ellis",
    email: "ellis@gmail.com",
    password: "abc123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

router.get("/", (_req, res) => {
  res.status(200).json(users);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ error: `user with id ${id} not found` });
  }

  res.status(200).json(user);
});

router.post("/", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: "Title, description, price, stock and category are required",
    });
  }

  const newUser: User = {
    id: v7(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  res.status(201).json({ message: "New user is created", id: newUser.id });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ error: `User with id ${id} not found` });
    throw new Error("Not found");
  }

  const indexOfUser = users.findIndex((user) => user.id === id);
  users.splice(indexOfUser, 1);

  res.status(200).json(user);
});

export default router;
