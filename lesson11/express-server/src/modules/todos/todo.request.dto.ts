import { z } from "zod";

export const createTodoDto = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

export type CreateTodoDto = z.infer<typeof createTodoDto>;
