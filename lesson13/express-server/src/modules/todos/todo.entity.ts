export interface Todo {
  id: string;
  title: string;
  content: string | null;
  done: boolean;
  userId: string;
  createdAt: Date;
}

export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  create(todo: {
    title: string;
    content?: string;
    userId: string;
  }): Promise<Todo>;
  delete(id: string): Promise<Todo | null>;
  findById(id: string): Promise<Todo | null>;
  update(
    id: string,
    data: { title?: string; content?: string },
  ): Promise<Todo | null>;
}
