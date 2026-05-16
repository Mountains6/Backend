import { ProductService } from "./product.service";
import { Request, Response } from "express";

export class ProductController {
  constructor(private readonly service: ProductService) {
    this.service = service;
  }

  getAll = async (_req: Request, res: Response) => {
    const products = await this.service.getAll();
    res.status(200).json(products);
  };

  create = async (req: Request, res: Response) => {
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || !price || !stock || !category) {
      res.status(400).json({ error: "Bad request" });
    }
    try {
      const product = await this.service.create(
        title,
        description,
        price,
        stock,
        category,
      );
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  };
}
