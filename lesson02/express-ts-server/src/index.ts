import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.get("/old-path", (_req, res) => {
  res.redirect(302, "/new-path");
});

app.get("/new-path", (_req, res) => {
  res.status(200).json({ message: "Welcome" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`
        Server started on port ${PORT} \n http://localhost:${PORT}
        `);
});
