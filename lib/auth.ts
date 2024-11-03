import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { SignInSchema } from "./zod";
import { serverClient } from "@/trpc/serverClient";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user: User | null = null;

        const { email, password } = await SignInSchema.parseAsync(credentials);

        const users = await serverClient.getUsers();

        const tempUser = users.find((user: User) => user.email === email);

        const compare = await bcrypt.compare(
          password,
          tempUser?.password as string
        );

        if (!compare) {
          throw new Error("Invalid credentials");
        }

        user = {
          id: tempUser?.id as string,
          email: tempUser?.email as string,
          username: tempUser?.username as string,
        };

        return user;
      },
    }),
  ],
});
