import express from "express";
import productRouter from "./modules/products/routes/products.routes";
import userRouter from "./modules/users/routes/users.routes";

const app = express();

app.use(express.json());

app.use("/products", productRouter);
app.use("/users", userRouter);

export default app;
