import { Todo, TodoRepository } from "./todo.entity";
import toTodoDtoResponse from "./todo.mapper";
import { CreateTodoDto, UpdateTodoDto } from "./todo.request.dto";

// Business logic
// DO NOT work here with express req res

export class TodoService {
  constructor(private readonly repo: TodoRepository) {
    this.repo = repo;
  }

  getAll(): Promise<Todo[]> {
    return this.repo.findAll();
  }

  create(todo: CreateTodoDto) {
    return this.repo.create(todo);
  }

  async getTodo(id: string, userId: string) {
    const todo = await this.repo.findById(id);

    // todo exists
    if (!todo) {
      throw new Error("Todo not found");
    }

    // check owner
    if (todo.userId !== userId) {
      throw new Error("Forbidden");
    }

    return toTodoDtoResponse(todo);
  }

  async deleteTodo(id: string, userId: string) {
    const todo = await this.repo.findById(id);

    // todo exists
    if (!todo) {
      throw new Error("Todo not found");
    }

    // check owner
    if (todo.userId !== userId) {
      throw new Error("Not allowed");
    }

    await this.repo.delete(id);

    return toTodoDtoResponse(todo);
  }

  async updateTodo(id: string, userId: string, dto: UpdateTodoDto) {
    const todo = await this.repo.findById(id);

    // todo exists
    if (!todo) {
      throw new Error("Todo not found");
    }

    // check owner
    if (todo.userId !== userId) {
      throw new Error("Not allowed");
    }

    const updateTodo = await this.repo.update(id, dto);

    if (!updateTodo) {
      throw new Error("DB Error updating todo");
    }

    return toTodoDtoResponse(updateTodo)
  }
}
