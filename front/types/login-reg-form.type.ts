import z from "zod";

  export const RegisterLoginForm = z.object({
    nickName: z.string().min(1, "Введите свой логин!").regex(/^[A-Za-z0-9_-]+$/, "Только английские буквы, цифры и [  _  -  ] !"),
    email: z.string().email("Введите корректный email!"),
    password: z.string().min(6, 'Пароль должен быть длиннее 6 символов!')
  });

  export type RegisterLoginForm = z.infer<typeof RegisterLoginForm>;