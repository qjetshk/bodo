import { z } from "zod";

export const AddBoardForm = z
  .object({
    name: z
      .string()
      .min(1, "Enter a board name!") 
      .max(100, "Board name must not exceed 100 characters!"), 
    description: z
      .string()
      .max(100, "Description must not exceed 100 characters!")
      .optional(),
    boardTemplateId: z.string().min(1, "Select a template!"),
    boardType: z.boolean(), // false - public, true - private
    membersToAdd: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.boardType === false) {
      // public board → at least one member is required
      if (!data.membersToAdd || data.membersToAdd.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "Add at least one member for a public board!",
        });
      }
    } else {
      // private board → members array must always be empty
      if (data.membersToAdd && data.membersToAdd.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "Members array must be empty for a private board",
        });
      }
    }
  });

export type AddBoardForm = z.infer<typeof AddBoardForm>;
