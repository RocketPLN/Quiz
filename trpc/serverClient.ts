import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({ url: "https://sigma-quiz-app.vercel.app/api/trpc" }),
  ],
});
