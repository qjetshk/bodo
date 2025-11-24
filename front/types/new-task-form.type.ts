import { z } from "zod";

export const NewTaskForm = z
  .object({
    title: z.string().min(1, "Введите название задачи!").max(51, 'Название не должно быть больше 50 символов!'),
    description: z
      .string()
      .min(1, 'Введите описание задачи')
      .max(2000, "Описание не должно быть больше 2000 символов!")
  })


export type NewTaskForm = z.infer<typeof NewTaskForm>;
