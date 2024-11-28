"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Question } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { correctPolishLetters } from "./utils";
import { toast } from "sonner";

function FillBlank({
  Score,
  question,
  Answered,
}: {
  Score: [number, Dispatch<SetStateAction<number>>];
  question: Question;
  Answered: [boolean, Dispatch<SetStateAction<boolean>>];
}) {
  const [score, setScore] = Score;
  const [answer, setAnswer] = useState<string>("");
  const [placeholder, setPlaceholder] = useState(question.question);
  const [answerd, setAnswered] = Answered;

  function checkAnswer() {
    setAnswered(true);
    setPlaceholder(answer);
    const Answer = correctPolishLetters(answer.toLocaleLowerCase());
    const CorrectAnswer = correctPolishLetters(
      question.correctAnswer[0].toLocaleLowerCase(),
    );

    if (Answer === CorrectAnswer) {
      setScore(score + 1);
      toast.success("Correct!");
      setAnswer("");
      return;
    }
    toast.error("Incorrect!");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Input
        className="w-full"
        placeholder={placeholder}
        value={answer}
        disabled={answerd}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <Button disabled={answerd} onClick={() => checkAnswer()}>
        Check
      </Button>
      {answerd && <p>Correct answer: {question.correctAnswer}</p>}
    </div>
  );
}

export default FillBlank;
