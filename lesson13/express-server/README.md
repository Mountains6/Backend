ORM - Object Relational Mapping
(Drizzle)

Это технология, которая связывает таблицы БД с объектами в коде
Мы сможем вызывать обычные функции и не прописывать вручную запросы на языке SQL
Зачем он нужен?

1. Ускорение разработки
2. Безопасность. Защита от sql инъекции
3. Миграция. Мы можем с лёгкостью перейти с одной СУБД на другую с
   минимальными изменениями в коде

4. Установили drizzle
   npm i drizzle-orm pg dotenv
   npm i -D drizzle-kit tsx @types/pg

5. Добовляем дополнительные скрипты скрипты для работы с БД в package.json
   "db:generate": "npx drizzle-kit generate",
   "db:migrate": "npx drizzle-kit migrate",

6. Вносим изменения в tsconfig.json
   "rootDir": ".",
   "include": ["src/**/*", "drizzle.config.ts"],

7. Добавление файла drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
out: "./drizzle",
schema: "./src/db/schema.ts",
dialect: "postgresql",
dbCredentials: {
url: process.env.DATABASE_URL_DRIZZLE_KIT!,
},
});

8. Добавили переменную среды в .env
PORT = 3000
DATABASE_URL = postgresql://postgres:postgres@db:5432/mydb
DATABASE_URL_DRIZZLE_KIT = postgresql://postgres:postgres@localhost:5432/mydb

POSTGRES_USER = postgres
POSTGRES_PASSWORD = postgres
POSTGRES_DB = mydb

9. В папке src создаём папку db и в ней два файла index.ts и schema.ts

10. Заполняем файл index.ts
import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const db: NodePgDatabase = drizzle(process.env.DATABASE_URL!);

11. Заполняем файл schema.ts
import {
boolean,
pgTable,
uuid,
varchar,
timestamp,
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
id: uuid().primaryKey().defaultRandom(),
title: varchar({ length: 255 }).notNull(),
done: boolean().notNull().default(false),
createdAt: timestamp().notNull().defaultNow(),
});

12. Добавление Dockerfile
FROM node:20

COPY package\*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
