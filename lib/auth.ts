import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { SignInSchema } from "./zod";
import { serverClient } from "@/trpc/serverClient";
import { Session } from "next-auth";

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

        const users = await serverClient.Users.getUsers();

        let tempUser = users.find((user) => user.email === email);

        if (!tempUser) {
          tempUser = users.find((user) => user.username === email);
        }

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
  pages: { error: "/api/auth/error" },
  callbacks: {
    async session({ session }: { session: Session }) {
      const users = await serverClient.Users.getUsers();
      const user = users.find((user) => user.email === session?.user?.email);

      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id,
          username: user?.username,
        },
      };
    },
  },
});
