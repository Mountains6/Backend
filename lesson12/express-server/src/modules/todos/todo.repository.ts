import { db } from "../../db";
import { todos } from "../../db/schema";
import { Todo, TodoRepository } from "./todo.entity";

export class DrizzleRepository implements TodoRepository {
  async findAll(): Promise<Todo[]> {
    return await db.select().from(todos);
  }

  async create(title: string): Promise<Todo> {
    const newTodo = {
      title,
      done: false,
    };

    const [todo] = await db.insert(todos).values(newTodo).returning();
    return todo;
  }
}
