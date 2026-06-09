import { z } from 'zod';

export const CreateBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publishedYear: z.coerce
    .number()
    .int('Published year must be an integer')
    .positive('Published year must be positive'),
  price: z.coerce.number().positive('Price must be positive'),
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;
