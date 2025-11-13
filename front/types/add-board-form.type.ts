import { z } from "zod";

export const AddBoardForm = z
  .object({
    name: z.string().min(1, "Введите название доски!"),
    description: z
      .string()
      .max(100, "Описание не должно быть больше 100 символов!")
      .optional(),
    templateId: z.string().min(1, "Выберите шаблон!"),
    boardType: z.boolean(),
    members: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {

    if (data.boardType === false) {
      if (!data.members || data.members.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "Добавьте хотя бы одного участника для публичной доски!",
        });
      }
    }
  });

export type AddBoardForm = z.infer<typeof AddBoardForm>;
