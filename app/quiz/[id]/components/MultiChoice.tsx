"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Question } from "@prisma/client";
import { Check } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

function MultiChoice({
  Score,
  Answered,
  question,
}: {
  Score: [number, Dispatch<SetStateAction<number>>];
  Answered: [boolean, Dispatch<SetStateAction<boolean>>];
  question: Question;
}) {
  const [score, setScore] = Score;
  const [answerd, setAnswered] = Answered;
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  function checkAnswers() {
    const questionAnswers = selectedAnswers.filter((answer) =>
      question.answer.includes(answer),
    );

    const correctQuestionAnswers = question.correctAnswer.filter((answer) =>
      answers.includes(answer),
    );

    const correctAnswers = questionAnswers.filter((answer) =>
      question.correctAnswer.includes(answer),
    );

    if (questionAnswers.length === 0) {
      toast.error("Please select all answers");
      return;
    }

    setAnswered(true);

    if (correctQuestionAnswers.length === correctAnswers.length) {
      toast.success("Correct!");
      setScore(
        score +
          Math.round(
            (correctAnswers.length / correctQuestionAnswers.length) * 100,
          ) /
            100,
      );
      return;
    }

    toast.error("Incorrect!");
  }

  useEffect(() => {
    setIsClient(true);
    const shuffleArray = (array: string[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    setAnswers(shuffleArray(question.answer));
  }, [question.answer]);

  const handleCheckboxChange = (answer: string) => {
    if (!answerd) {
      setSelectedAnswers((prev) => {
        if (prev.includes(answer)) {
          return prev.filter((a) => a !== answer);
        }
        return [...prev, answer];
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {answers.map((answer, index) => (
        <div
          key={index}
          className={cn(
            "flex w-1/2 items-center justify-between rounded-md bg-secondary p-4 text-xl",
            answerd &&
              question.correctAnswer.includes(answer) &&
              "bg-primary text-white",
          )}
        >
          <span>{answer}</span>
          <Checkbox
            className={cn("border border-primary", answerd && "border-muted")}
            checked={selectedAnswers.includes(answer)}
            onCheckedChange={() => handleCheckboxChange(answer)}
            disabled={answerd}
          />
        </div>
      ))}
      <Button
        className="m-4 w-full p-4 text-lg font-semibold"
        onClick={() => checkAnswers()}
        disabled={answerd}
      >
        Check <Check className="size-10" />
      </Button>
    </div>
  );
}

export default MultiChoice;
