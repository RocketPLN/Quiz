import { router } from "@/server/trpc";
import { Users } from "./routers/Users";
import { Quizzes } from "./routers/Quizzes";

export const appRouter = router({
  Users,
  Quizzes,
});

export type AppRouter = typeof appRouter;
