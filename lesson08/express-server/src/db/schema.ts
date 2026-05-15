import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  done: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});
