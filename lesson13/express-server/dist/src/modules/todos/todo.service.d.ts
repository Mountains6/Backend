import { TodoRepository } from "./todo.entity";
import { CreateTodoDto } from "./todo.request.dto";
import { TodoResponseDto } from "./todo.response.dto";
export declare class TodoService {
    private readonly repo;
    constructor(repo: TodoRepository);
    getAll(): Promise<TodoResponseDto[]>;
    create(dto: CreateTodoDto): Promise<TodoResponseDto>;
}
//# sourceMappingURL=todo.service.d.ts.map