import express, { Request, Response, NextFunction } from "express";

import { buildProductRouter } from "./modules/products/product.containers";
import { buildUserRouter } from "./modules/users/user.containers";

const app = express();

app.use(express.json());

app.use("/products", buildProductRouter());
app.use("/users", buildUserRouter());

export default app;
