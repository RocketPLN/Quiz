import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Question, Quiz } from "@prisma/client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type QuizInfoProps = {
  quiz: {
    User: {
      id: string;
      username: string;
      email: string;
    };
    questions: Question[];
  } & Quiz;
};

const categoryEmoji = [
  {
    name: "ENGLISH",
    emoji: "🇬🇧",
  },
  {
    name: "DEUTSCH",
    emoji: "🇩🇪",
  },
  {
    name: "BIOLOGIE",
    emoji: "🧬",
  },
  {
    name: "PRABUCKI",
    emoji: "💻",
  },
  {
    name: "OTHER",
    emoji: "🍄",
  },
];

function QuizInfo({ quiz }: QuizInfoProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md bg-muted/50 p-4 backdrop-blur-md">
      <p className="text-2xl font-semibold">{quiz.title}</p>
      <div className="flex gap-2">
        <p>
          Category:{" "}
          {quiz.category.at(0) + quiz.category.toLocaleLowerCase().slice(1)}{" "}
          {categoryEmoji.find((emoji) => emoji.name === quiz.category)?.emoji}
        </p>
        <Separator orientation="vertical" />
        <p>Creator: {quiz.User.username}</p>
      </div>
      <Link href={`/quiz/${quiz.id}`} className="w-full">
        <Button className="w-full">
          Open Quiz <ArrowUpRight />
        </Button>
      </Link>
      <Separator />
      <span className="text-sm text-muted-foreground">
        Updated at: {new Date(quiz.updatedAt).toLocaleString()}
      </span>
    </div>
  );
}

export default QuizInfo;
