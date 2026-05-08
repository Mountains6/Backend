export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: "Laptop" | "PC" | "Monitor" | "Keyboard" | "Mouse";
  createdAt: string;
}
