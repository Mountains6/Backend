export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
}

// Interface for repository
export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
}
