import { db } from "@/lib/database";
import { publicProcedure, router } from "@/server/trpc";

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.user.findMany();
  }),
});

export type AppRouter = typeof appRouter;
