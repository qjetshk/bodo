import { z } from "zod";

export const EditBoardForm = z
  .object({
    name: z
      .string()
      .min(1, "Enter a board name!") 
      .max(100, "Board name must not exceed 100 characters!"), 
    description: z
      .string()
      .max(100, "Description must not exceed 100 characters!") 
      .optional(),
    membersToAdd: z.array(z.string()).optional(),
  });

export type EditBoardForm = z.infer<typeof EditBoardForm>;
