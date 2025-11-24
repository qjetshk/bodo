import { z } from "zod";

export const EditBoardForm = z
  .object({
    name: z.string().min(1, "Введите название доски!").max(100, 'Название не должно быть больше 100 символов!'),
    description: z
      .string()
      .max(101, "Описание не должно быть больше 100 символов!")
      .optional(),

    membersToAdd: z.array(z.string()).optional(),
  })


export type EditBoardForm = z.infer<typeof EditBoardForm>;
