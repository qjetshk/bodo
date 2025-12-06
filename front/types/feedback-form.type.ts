import z from "zod";

export const feedbackFormSchema  = z.object({
    nickName: z.string().min(1, "Введите свой логин!").regex(/^[A-Za-z0-9_-]+$/, "Только английские буквы, цифры и [  _  -  ] !"),
    email: z.string().email("Введите корректный email!"),
    message: z.string().min(1, 'Введите ваше пожелание!').max(2000, 'Пожелание не может быть больше 2000 символов!')
});

export type FeedbackForm = z.infer<typeof feedbackFormSchema>;