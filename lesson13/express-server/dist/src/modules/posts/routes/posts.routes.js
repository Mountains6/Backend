"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const posts = [
    { id: (0, uuid_1.v7)(), title: "Cloudy weather", text: "It is dark again" },
    { id: (0, uuid_1.v7)(), title: "Job", text: "I got new job" },
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
    const post = { id: (0, uuid_1.v7)(), title, text };
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
exports.default = router;
//# sourceMappingURL=posts.routes.js.map