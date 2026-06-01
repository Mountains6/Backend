import { z } from "zod";
export declare const createTodoDto: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export type CreateTodoDto = z.infer<typeof createTodoDto>;
//# sourceMappingURL=todo.request.dto.d.ts.map