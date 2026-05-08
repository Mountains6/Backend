import { Router } from "express";
import { v7 } from "uuid";
import { Product } from "../products.types";

const router = Router();

const products: Product[] = [
  {
    id: v7(),
    title: "MSI Laptop",
    description: "High performance Laptop",
    price: 1199.99,
    stock: 21,
    category: "Laptop",
    createdAt: new Date().toISOString(),
  },
  {
    id: v7(),
    title: "MSI PC",
    description: "High performance PC",
    price: 1299.99,
    stock: 12,
    category: "PC",
    createdAt: new Date().toISOString(),
  },
];

router.get("/", (_req, res) => {
  res.status(200).json(products);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === id);

  if (!product) {
    res.status(404).json({ error: `Product with id ${id} not found` });
  }

  res.status(200).json(product);
});

router.post("/", (req, res) => {
  const { title, description, price, stock, category } = req.body;

  if (!title || !description || !price || !stock || !category) {
    return res
      .status(400)
      .json({
        error: "Title, description, price, stock and category are required",
      });
  }

  const newProduct: Product = {
    id: v7(),
    title,
    description,
    price,
    stock,
    category,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  res
    .status(201)
    .json({ message: "New Product item is created", id: newProduct.id });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const product = products.find((product) => product.id === id);

  if (!product) {
    res.status(404).json({ error: `Product with id ${id} not found` });
    throw new Error("Not found");
  }

  const indexOfProduct = products.findIndex((product) => product.id === id);
  products.splice(indexOfProduct, 1);

  res.status(200).json(product);
});

export default router;