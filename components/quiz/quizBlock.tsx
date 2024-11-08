"use client";

import { Button } from "@/components/ui/button";
import Tooltip from "@/components/tooltip";

import { PencilRuler, Smile, Trash } from "lucide-react";
import { Quiz } from "@prisma/client";
import { trpc } from "@/trpc/client";

function QuizBlock({ quiz }: { quiz: Quiz }) {
  const removeQuiz = trpc.Quizzes.removeQuiz.useMutation();

  const createdAt = new Date(quiz.createdAt).toLocaleDateString();
  const updatedAt = new Date(quiz.updatedAt).toLocaleDateString();

  return (
    <div className="border rounded-md p-6 bg-muted/50 backdrop:blur-lg capitalize leading-snug">
      <h2 className="text-2xl font-semibold text-center mb-4">{quiz.title}</h2>
      <p>Kategoria: {quiz.category.toLocaleLowerCase()}</p>
      <span className="text-muted-foreground text-sm">
        <p>Utworzono: {createdAt}</p>
        <p>Ostatnia edycja: {updatedAt}</p>
      </span>
      <div className="mt-4 flex justify-between items-center">
        <Tooltip content="Edytuj" asChild>
          <Button variant="outline">
            <PencilRuler />
          </Button>
        </Tooltip>
        <Smile />
        <Tooltip content="Usuń" asChild>
          <Button
            variant="destructive"
            onClick={async () => {
              await removeQuiz.mutateAsync({ id: quiz.id });
              globalThis.location.reload();
            }}
          >
            <Trash />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default QuizBlock;
