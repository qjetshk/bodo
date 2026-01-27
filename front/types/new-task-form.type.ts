import { z } from "zod";
import { Priorities } from "@/apollo/gql/graphql";

export const NewTaskForm = z.object({
  title: z
    .string()
    .min(1, "Enter the task title!") 
    .max(51, "Title must not exceed 50 characters!"), 
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters!") 
    .optional(),
  deadlineDate: z.date().nonoptional(),
  membersIds: z.array(z.string()).optional(),
  priority: z.nativeEnum(Priorities).nonoptional(),
});

export type NewTaskForm = z.infer<typeof NewTaskForm>;

