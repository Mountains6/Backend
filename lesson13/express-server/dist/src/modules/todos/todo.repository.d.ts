import { Todo, TodoRepository } from "./todo.entity";
export declare class DrizzleRepository implements TodoRepository {
    findAll(): Promise<Todo[]>;
    create(title: string): Promise<Todo>;
}
//# sourceMappingURL=todo.repository.d.ts.map