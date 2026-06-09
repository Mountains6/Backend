import z from 'zod';

export const CreateArtifactSchema = z.object({
  name: z.string().min(3, 'Name must at least contains 3 symbols'),
  age: z.number().min(0, 'Age must be positive'),
});

// Тип после парсинга
export type CreateArtifactDto = z.infer<typeof CreateArtifactSchema>;
