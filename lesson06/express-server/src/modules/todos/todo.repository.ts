import { Todo, TodoRepository } from "./todo.entity";
import { v7 } from "uuid";

// Working with DB
export class InMemoryRepository implements TodoRepository {
  private store: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values());
  }

  async create(title: string): Promise<Todo> {
    const todo: Todo = {
      id: v7(),
      title,
      done: false,
      createdAt: new Date(),
    };

    this.store.set(todo.id, todo);
    return todo;
  }
}

// findAll, create, update, findById, delete
