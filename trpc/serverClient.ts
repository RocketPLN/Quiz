import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({ url: "https://quiz-blond-sigma.vercel.app/api/trpc" }),
  ],
});
