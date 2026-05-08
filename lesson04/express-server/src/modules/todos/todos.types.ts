export interface Todo {
  id: string;
  title: string;
  content: string;
  status: "pending" | "completed";
  createdAt: string;
}