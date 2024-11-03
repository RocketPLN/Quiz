import { db } from "@/lib/database";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { createQuizSchema } from "@/lib/zod";

export const getQuizzes = publicProcedure.query(async () => {
  return await db.quiz.findMany();
});

export const getQuiz = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    return await db.quiz.findFirst({
      where: {
        id: input.id,
      },
    });
  });

export const createQuiz = publicProcedure
  .input(createQuizSchema)
  .mutation(async ({ input }) => {
    return await db.quiz.create({
      data: {
        creatorId: input.creatorId,
        title: input.title,
        category: input.category,
      },
    });
  });

export const Quizzes = {
  getQuizzes,
  getQuiz,
  createQuiz,
};
