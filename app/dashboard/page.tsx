import BackgroundEffect from "@/components/backgroundEffect";
import CreateQuiz from "@/components/quiz/createQuiz";
import QuizDashboard from "@/components/quiz/quizDashboard";

import { auth } from "@/lib/auth";
import { serverClient } from "@/trpc/serverClient";

import { Session } from "next-auth";
import { redirect } from "next/navigation";

async function Dashboard() {
  const session: Session | null = await auth();
  if (!session) redirect("/");

  const quizzes = await serverClient.Quizzes.getQuizByCreator({
    creatorId: session.user.id,
  });

  return (
    <>
      <BackgroundEffect />
      <div className="flex w-screen flex-col items-center">
        <h1 className="m-12 bg-gradient-to-r from-primary to-destructive bg-clip-text text-6xl font-bold text-transparent">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="place-self-center md:col-span-3">
            <CreateQuiz creatorId={session.user.id} />
          </div>
          {quizzes.length != 0 ? (
            quizzes.map((quiz) => <QuizDashboard quiz={quiz} key={quiz.id} />)
          ) : (
            <div className="p-8 text-center text-4xl font-bold md:col-span-3">
              Not Found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
