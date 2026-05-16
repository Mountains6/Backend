import { db } from "../../db";
import { products } from "../../db/schema";
import { Product, ProductCategory, ProductRepository } from "./product.entity";

export class DrizzleRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async create(
    title: string,
    description: string,
    price: number,
    stock: number,
    category: ProductCategory,
  ): Promise<Product> {
    const newProduct = {
      title,
      description,
      price,
      stock,
      category,
    };

    const [product] = await db.insert(products).values(newProduct).returning();
    return product;
  }
}
