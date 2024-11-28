"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Tooltip from "@/components/tooltip";
import MultiChoice from "./MultiChoice";
import ABC from "./ABC";
import FillBlank from "./FillBlank";

import { Question } from "@prisma/client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

function Quiz({ questions }: { questions: Question[] }) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const score = useState<number>(0);

  const renderOptions = () => {
    switch (questions[currentQuestion].type) {
      case "ABC":
        return <ABC Score={score} question={questions[currentQuestion]} />;
      case "MULTIPLE_CHOICE":
        return (
          <MultiChoice Score={score} question={questions[currentQuestion]} bool={false}  />
        );
      case "FILL_BLANK":
        return (
          <FillBlank Score={score} question={questions[currentQuestion]} />
        );
    }
  };

  if (questions.length === currentQuestion) {
    return (
      <div className="m-12 flex w-[50%] flex-col items-center justify-center gap-4">
        <h1 className="text-center text-3xl font-bold">Finished</h1>
        <h1 className="text-center text-3xl font-bold">
          Score: {Math.round((score[0] / questions.length) * 100)}%
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            score[1](0);
            setCurrentQuestion(0);
          }}
        >
          Start Again
        </Button>
      </div>
    );
  }

  return (
    <div className="m-12 flex w-[50%] flex-col items-center justify-center gap-4">
      <Progress
        value={Math.round((currentQuestion / questions.length) * 100)}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-3xl font-bold">
          {questions[currentQuestion].question}
        </h1>
        <h3 className="text-center text-xl font-bold">
          {questions[currentQuestion].type}
        </h3>
        {renderOptions()}
        <Tooltip
          asChild
          content="If you don't answer, you will be marked as incorrect"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Next <ArrowRight />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Quiz;
