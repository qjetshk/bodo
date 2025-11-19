import { z } from "zod";

export const EditBoardForm = z
  .object({
    name: z.string().min(1, "Введите название доски!").max(100, 'Название не должно быть больше 100 символов!'),
    description: z
      .string()
      .max(101, "Описание не должно быть больше 100 символов!")
      .optional(),
    boardType: z.boolean(), // false - публичная, true - приватная
    membersToAdd: z.array(z.string()).optional(),
    canAddMember: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (data.boardType === false) {
      // публичная доска → нужно хотя бы одного участника
      if ((!data.membersToAdd || data.membersToAdd.length === 0) && !data.canAddMember) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "Добавьте хотя бы одного участника для публичной доски!",
        });
      }
    } else {
      // приватная доска → members всегда пустой
      if (data.membersToAdd && data.membersToAdd.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "Для приватной доски массив участников должен быть пустым",
        });
      }
    }
  });

export type EditBoardForm = z.infer<typeof EditBoardForm>;
