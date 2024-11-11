import { auth } from "@/lib/auth";
import { serverClient } from "@/trpc/serverClient";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import QuestionForm from "./form";

async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session: Session | null = await auth();
  const quiz = await serverClient.Quizzes.getQuiz({ id: (await params).id });

  if (!session?.user) {
    redirect("/");
  }

  if (!quiz || quiz?.User.id !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex w-screen flex-col items-center justify-center gap-4">
      <QuestionForm quizId={quiz.id} initialQuestions={quiz.questions} />
    </div>
  );
}

export default QuizPage;
