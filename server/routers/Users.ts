import { db } from "@/lib/database";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { SignUpSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

const cachedUsersFetcher = unstable_cache(() => db.user.findMany(), ["users"], {
  tags: ["users"],
  revalidate: 3600,
});

export const getUsers = publicProcedure.query(async () => {
  const users: User[] = await cachedUsersFetcher();
  return users;
});

export const getUser = publicProcedure
  .input(
    z.object({
      id: z.string().optional(),
      username: z.string().optional(),
      email: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const users: User[] = await cachedUsersFetcher();

    const user = users.find(
      (user) =>
        user.email === input.email ||
        user.username === input.email ||
        user.id === input.id
    );

    return user;
  });

export const createUser = publicProcedure
  .input(SignUpSchema)
  .mutation(async ({ input }) => {
    const salt = await bcrypt.genSalt(10);
    const pwHash = await bcrypt.hash(input.password, salt);

    const user = await db.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: pwHash,
      },
    });

    revalidateTag("users");

    return user;
  });

export const Users = {
  getUsers,
  getUser,
  createUser,
};
