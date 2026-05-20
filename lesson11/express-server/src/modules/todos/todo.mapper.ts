import { Todo } from "./todo.entity";
import { TodoResponseDto } from "./todo.response.dto";

export default function toTodoResponse(todo: Todo): TodoResponseDto {
  return {
    id: todo.id,
    title: todo.title,
    done: todo.done,
    createdAt: todo.createdAt.toISOString(),
  };
}