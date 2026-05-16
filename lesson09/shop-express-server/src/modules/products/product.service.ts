import { Product, ProductCategory, ProductRepository } from "./product.entity";

export class ProductService {
  constructor(private readonly repo: ProductRepository) {
    this.repo = repo;
  }

  getAll(): Promise<Product[]> {
    return this.repo.findAll();
  }

  create(
    title: string,
    description: string,
    price: number,
    stock: number,
    category: ProductCategory,
  ) {
    if (!title) {
      throw new Error("Title is required");
    } else if (!description) {
      throw new Error("Description is required");
    } else if (price <= 0) {
      throw new Error("Price must be bigger than 0");
    } else if (stock < 0) {
      throw new Error("Stock cannot be negative");
    } else if (!category) {
      throw new Error("Category must be selected");
    }
    
    return this.repo.create(title, description, price, stock, category);
  }
}
