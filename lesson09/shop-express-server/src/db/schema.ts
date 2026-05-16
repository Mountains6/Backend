import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { ProductCategory } from "../modules/products/product.entity";
import { UserRole } from "../modules/users/user.entity";

export const products = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 300 }).notNull(),
  price: integer().notNull(),
  stock: integer().notNull(),
  category: varchar({ length: 50 }).notNull().$type<ProductCategory>(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 30 }).notNull(),
  role: varchar({ length: 50 }).notNull().$type<UserRole>(),
  createdAt: timestamp().notNull().defaultNow(),
});
