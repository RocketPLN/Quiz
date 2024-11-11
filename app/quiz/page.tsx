import BackgroundEffect from "@/components/backgroundEffect";
import QuizInfo from "@/components/quiz/quizInfo";

import { serverClient } from "@/trpc/serverClient";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const quizzes = await serverClient.Quizzes.getQuizzes();

  const filteredQuizzes = params.category
    ? quizzes.filter((quiz) => {
        const category = params.category;
        if (typeof category === "string") {
          return quiz.category === category.toLocaleUpperCase();
        }
        return false;
      })
    : quizzes;

  return (
    <>
      <BackgroundEffect />
      <h1 className="p-8 text-center text-6xl font-bold">Quiz</h1>
      <div className="mx-4 mt-6 grid grid-cols-1 place-content-center gap-4 md:grid-cols-5">
        {filteredQuizzes.map((quiz) => (
          <QuizInfo quiz={quiz} key={quiz.id} />
        ))}
      </div>
    </>
  );
}
