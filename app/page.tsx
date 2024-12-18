import BackgroundEffect from "@/components/backgroundEffect";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BookCopy, UserRound } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-screen flex-col items-center justify-center overflow-x-hidden">
      <BackgroundEffect />
      <div className="flex h-[50vh] items-center">
        <h1 className="font-display inline-flex animate-shine flex-col gap-1 bg-gradient-to-r from-primary from-40% via-white/80 via-50% to-primary/90 to-60% bg-[length:300%_100%] bg-clip-text bg-[position:50%_50%] p-2 text-center text-6xl font-bold capitalize leading-none text-transparent md:text-[8rem]">
          <span>Quiz App</span> <span>for better learning</span>
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 md:w-8/12 md:flex-row md:gap-2">
        <div className="flex w-3/4 flex-col items-center justify-center gap-3 rounded-lg bg-muted/50 px-2 py-8 text-lg backdrop-blur-lg md:w-1/3 md:rounded-l-3xl">
          <h2 className="text-2xl font-semibold">Quizzes</h2>
          <span className="text-md text-muted-foreground">
            Create quizzes and test yourself
          </span>
          <Link href="/dashboard">
            <Button variant="destructive" className="text-xl">
              Create Quiz <ArrowUpRight />
            </Button>
          </Link>
        </div>
        <div className="flex w-3/4 flex-col items-center justify-center gap-3 rounded-lg bg-muted/50 px-2 py-8 text-lg backdrop-blur-lg md:w-1/3">
          <h2 className="text-2xl font-semibold">Fun</h2>
          <span className="text-md text-muted-foreground">
            Have fun with learning 😎
          </span>
          <Link href="/quiz">
            <Button variant="destructive" className="text-xl">
              Find Quiz <ArrowUpRight />
            </Button>
          </Link>
        </div>
        <div className="flex w-3/4 flex-col items-center justify-center gap-3 rounded-lg bg-muted/50 px-2 py-8 text-lg backdrop-blur-lg md:w-1/3 md:rounded-r-3xl">
          <h2 className="text-2xl font-semibold">Learning expierience</h2>
          <span className="text-md text-muted-foreground">
            Improve your learning experience
          </span>
          <Link href="/auth">
            <Button variant="destructive" className="text-xl">
              Join Us <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative mt-[25vh] flex w-screen flex-col items-center py-20">
        <BackgroundEffect />
        <h1 className="text-center text-4xl font-semibold" id="about">
          About Quiz App
        </h1>
        <div className="mt-4 grid w-1/2 grid-cols-1 place-items-center md:grid-cols-2">
          <div className="hidden h-[90%] w-[80%] flex-col items-center justify-center gap-4 rounded-lg bg-muted/40 px-20 py-24 backdrop-blur-lg md:flex">
            <h2 className="text-2xl font-semibold">Why is created?</h2>
            <BookCopy size={120} />
          </div>
          <span className="text-lg">
            <p className="text-center font-semibold md:hidden">
              Why is created?
            </p>
            This app was created to help users improve their learning experience
            by providing quizzes and fun activities. It is designed to be
            user-friendly and easy to navigate, making it accessible to anyone
            who wants to learn new things.
          </span>
        </div>
        <div className="mt-4 grid w-1/2 grid-cols-1 place-items-center md:grid-cols-2">
          <span className="text-lg">
            <p className="text-center font-semibold md:hidden">About me</p> I am
            a software engineer and a passionate learner. I have a strong
            interest in computer science and programming, and I am always
            looking for new ways to improve my skills and knowledge. I am also a
            dedicated user of this app, and I am constantly striving to make it
            better and more user-friendly.
          </span>
          <div className="hidden h-[90%] w-[80%] flex-col items-center justify-center gap-4 rounded-lg bg-muted/40 px-20 py-24 backdrop-blur-lg md:flex">
            <h2 className="text-2xl font-semibold">About Me</h2>
            <UserRound size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
