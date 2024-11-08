import { QuizCategory } from "@prisma/client";
import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .optional(),
  username: z
    .string({ required_error: "Username is required" })
    .min(1)
    .optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const SignUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(32, "Username must be less than 32 characters"),
});

export const createQuizSchema = z.object({
  creatorId: z.string(),
  title: z.string(),
  category: z.nativeEnum(QuizCategory),
});
