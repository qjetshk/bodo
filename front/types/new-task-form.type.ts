import { z } from "zod";
import { Priorities } from "@/apollo/gql/graphql"


export const NewTaskForm = z
  .object({
    title: z.string().min(1, "Введите название задачи!").max(51, 'Название не должно быть больше 50 символов!'),
    description: z
      .string()
      .max(2000, "Описание не должно быть больше 2000 символов!").optional(),
    deadlineDate: z.date().nonoptional(),
    membersIds: z.array(z.string()).optional(),
    priority: z.nativeEnum(Priorities).nonoptional()
  })

export type NewTaskForm = z.infer<typeof NewTaskForm>;
