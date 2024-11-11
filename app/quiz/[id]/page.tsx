import BackgroundEffect from "@/components/backgroundEffect";
import { serverClient } from "@/trpc/serverClient";
import Quiz from "./components/quiz";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const quizId = (await params).id;
  const quiz = await serverClient.Quizzes.getQuiz({ id: quizId });

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <>
      <BackgroundEffect />
      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        <h1 className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-8xl font-semibold capitalize text-transparent">
          {quiz.title}
        </h1>
        <Quiz questions={quiz.questions} />
      </div>
    </>
  );
}

export default Page;
