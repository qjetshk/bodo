import { z } from "zod";

export const RegisterLoginForm = z.object({
  nickName: z
    .string()
    .min(1, "Enter your username!") 
    .regex(/^[A-Za-z0-9_-]+$/, "Only English letters, numbers, and [ _ - ] are allowed!"), 
  email: z
    .string()
    .email("Enter a valid email!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long!") 
});

export type RegisterLoginForm = z.infer<typeof RegisterLoginForm>;
