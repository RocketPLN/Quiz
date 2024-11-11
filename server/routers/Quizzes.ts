import { db } from "@/lib/database";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { createQuestionSchema, createQuizSchema } from "@/lib/zod";
import { revalidateTag, unstable_cache } from "next/cache";

const cachedQuizzesFetcher = unstable_cache(
  () =>
    db.quiz.findMany({
      include: {
        User: { select: { id: true, username: true, email: true } },
        questions: true,
      },
      orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
    }),
  ["quizzes"],
  {
    tags: ["quizzes"],
    revalidate: 3600,
  },
);

export const getQuizzes = publicProcedure.query(async () => {
  return await cachedQuizzesFetcher();
});

export const getQuiz = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const quizzes = await cachedQuizzesFetcher();

    const quiz = quizzes.find((quiz) => quiz.id === input.id);

    return quiz;
  });

export const getQuizByCreator = publicProcedure
  .input(z.object({ creatorId: z.string() }))
  .query(async ({ input }) => {
    const quizzes = await cachedQuizzesFetcher();

    const quiz = quizzes.filter((quiz) => quiz.creatorId === input.creatorId);

    return quiz;
  });

export const createQuiz = publicProcedure
  .input(createQuizSchema)
  .mutation(async ({ input }) => {
    const quiz = await db.quiz.create({
      data: {
        creatorId: input.creatorId,
        title: input.title,
        category: input.category,
      },
    });

    revalidateTag("quizzes");

    return quiz;
  });

export const removeQuiz = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await db.question.deleteMany({ where: { quizId: input.id } });
    await db.quiz.delete({ where: { id: input.id } });

    revalidateTag("quizzes");

    return;
  });

export const createQuestions = publicProcedure
  .input(z.array(createQuestionSchema))
  .mutation(async ({ input }) => {
    const questions = await Promise.all(
      input.map(async (question) => {
        return db.question.upsert({
          where: { id: question.id || "" },
          update: {
            question: question.question,
            answer: question.answer,
            type: question.type,
            correctAnswer: question.correctAnswer,
          },
          create: {
            quizId: question.quizId,
            question: question.question,
            answer: question.answer,
            type: question.type,
            correctAnswer: question.correctAnswer,
          },
        });
      }),
    );

    revalidateTag("quizzes");

    return questions;
  });

export const Quizzes = {
  getQuizzes,
  getQuiz,
  getQuizByCreator,
  createQuiz,
  removeQuiz,
  createQuestions,
};
