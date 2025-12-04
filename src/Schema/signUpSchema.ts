import { email, z } from "zod";

export const usernamValidation = z
  .string()
  .min(2, "minimum 2 charcter required")
  .max(20, "maximum 20 character allowed")
  .regex(/^[a-zA-Z0-9_]+$/, "username  contain Special Character");

export const SignupSchema = z.object({
  username: usernamValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, "minimum 6 character are allowed")
    .max(12, { message: "password are not more than 20 character" }),
});
