import { TodoRepository } from "./todo.entity";
import toTodoResponse from "./todo.mapper";
import { CreateTodoDto } from "./todo.request.dto";
import { TodoResponseDto } from "./todo.response.dto";

export class TodoService {
  constructor(private readonly repo: TodoRepository) {}

  async getAll(): Promise<TodoResponseDto[]> {
    const todos = await this.repo.findAll();
    return todos.map(toTodoResponse);
  }

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.repo.create(dto.title);
    return toTodoResponse(todo);
  }
}