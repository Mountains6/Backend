export type ProductCategory =
  | "Laptop"
  | "PC"
  | "Monitor"
  | "Keyboard"
  | "Mouse";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  createdAt: Date;
}

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  create(
    title: string,
    description: string,
    price: number,
    stock: number,
    category: ProductCategory,
  ): Promise<Product>;
}
