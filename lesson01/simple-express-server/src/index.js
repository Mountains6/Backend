// Подключение библиотеки
import express from "express";

// Создание приложения. "Управление" сервером
const app = express();

// Middleware - учит сервер понимать json в теле входящих запросов
app.use(express.json());

// Создание адреса по которому к нашему серверу можно постучатся и
// метод, который клиент должен изпользовать
app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

// При запуске сервер будет занимать порт (который мы должны указать) и
// слушать
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
