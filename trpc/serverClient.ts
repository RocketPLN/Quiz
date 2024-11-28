import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https//:${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const serverClient = appRouter.createCaller({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});
