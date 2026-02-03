import { z } from "zod";

export const feedbackFormSchema = z.object({
  nickName: z
    .string()
    .min(1, "Enter your username!") 
    .regex(/^[A-Za-z0-9_-]+$/, "Only English letters, numbers, and [ _ - ] are allowed!"), 
  email: z
    .string()
    .email("Enter a valid email!"),
  message: z
    .string()
    .min(1, "Enter your feedback!") 
    .max(2000, "Feedback cannot exceed 2000 characters!"), 
});

export type FeedbackForm = z.infer<typeof feedbackFormSchema>;
