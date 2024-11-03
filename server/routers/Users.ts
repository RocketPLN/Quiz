import { db } from "@/lib/database";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const getUsers = publicProcedure.query(async () => {
  return await db.user.findMany();
});

export const getUser = publicProcedure
  .input(
    z.object({ id: z.string().optional(), username: z.string().optional() })
  )
  .query(async ({ input }) => {
    return await db.user.findFirst({
      where: {
        OR: [{ id: input.id }, { username: input.username }],
      },
    });
  });

export const Users = {
  getUsers,
  getUser,
};
