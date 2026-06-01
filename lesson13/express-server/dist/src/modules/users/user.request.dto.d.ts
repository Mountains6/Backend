import { z } from "zod";
export declare const registerDto: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginDto: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof registerDto>;
//# sourceMappingURL=user.request.dto.d.ts.map