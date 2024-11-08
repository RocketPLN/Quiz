import BackgroundEffect from "@/components/backgroundEffect";
import CreateQuiz from "@/components/quiz/createQuiz";
import QuizBlock from "@/components/quiz/quizBlock";

import { auth } from "@/lib/auth";
import { serverClient } from "@/trpc/serverClient";

import { Session } from "next-auth";
import { redirect } from "next/navigation";

async function Dashboard() {
  const session: Session = await auth();
  if (!session) redirect("/");

  const quizzes = await serverClient.Quizzes.getQuizByCreator({
    creatorId: session.user.id,
  });

  return (
    <>
      <BackgroundEffect />
      <div className="flex items-center flex-col w-screen">
        <h1 className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent text-6xl font-bold m-12">
          Dashboard
        </h1>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <div className="md:col-span-3 place-self-center">
            <CreateQuiz creatorId={session.user.id} />
          </div>
          {quizzes.length != 0 ? (
            quizzes.map((quiz) => <QuizBlock quiz={quiz} key={quiz.id} />)
          ) : (
            <div className="md:col-span-3 text-center text-4xl p-8 font-bold">
              Not Found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
