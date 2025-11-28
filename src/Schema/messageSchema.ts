import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "at leatest 10 charachter required" })
    .max(300, { message: "maximum 300 character are allowed" }),
});
