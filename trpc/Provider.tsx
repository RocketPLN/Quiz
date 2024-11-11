"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./client";
import React, { useState } from "react";
import { httpBatchLink } from "@trpc/client";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({ url: "https://quiz-blond-sigma.vercel.app/api/trpc" }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Provider;
