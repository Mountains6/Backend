import { z } from 'zod';

export const CreateCarSchema = z.object({
  brand: z.string().min(2, 'Brand must contain at least 2 characters'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .int('Year must be an integer')
    .min(2000, 'Year must be at least 2000')
    .positive('Year must be positive'),
  price: z.number().positive('Price must be positive'),
});

export type CreateCarDto = z.infer<typeof CreateCarSchema>;