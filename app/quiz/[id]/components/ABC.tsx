"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

function ABC({
  Score,
  question,
}: {
  Score: [number, Dispatch<SetStateAction<number>>];
  question: Question;
}) {
  const [score, setScore] = Score;
  const [answers, setAnswers] = useState<string[]>(question.answer);
  const [answerd, setAnswerd] = useState<boolean>(false);

  const alphabet = [...Array(26).keys()].map((i) =>
    String.fromCharCode(i + 97).toUpperCase(),
  );

  useEffect(() => {
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

  function checkAnswer(answer: string): boolean {
    setAnswerd(true);
    if (question.correctAnswer.includes(answer)) {
      toast.success("Correct!");
      setScore(score + 1);
      return true;
    }
    toast.error("Incorrect!");
    return false;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {answers.map((answer, index) => (
        <Button
          key={index}
          type="button"
          variant="secondary"
          className={cn(
            "w-full p-4 text-xl",
            "grid grid-cols-2 place-content-center",
            answerd &&
              question.correctAnswer.includes(answer) &&
              "disabled:bg-primary disabled:text-white",
          )}
          disabled={answerd}
          onClick={() => checkAnswer(answer)}
        >
          <span className="w-1/5">{alphabet[index]}</span>
          <span className="w-4/5"> {answer}</span>
        </Button>
      ))}
    </div>
  );
}

export default ABC;
