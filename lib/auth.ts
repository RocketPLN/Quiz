import NextAuth, { DefaultSession, User } from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import { SignInSchema } from "./zod";
import { serverClient } from "@/trpc/serverClient";

declare module "next-auth" {
  interface User {
    username: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
    } & DefaultSession["user"];
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        let user: User | null = null;

        const { email, password } = await SignInSchema.parseAsync(credentials);

        const users = await serverClient.Users.getUsers();

        let tempUser = users.find((user) => user.email === email);

        if (!tempUser) {
          tempUser = users.find((user) => user.username === email);
        }

        if (!tempUser) {
          throw new Error("User not found");
        }

        const compare = await bcrypt.compare(password, tempUser.password);

        if (!compare) {
          throw new Error("Invalid credentials");
        }

        user = {
          id: tempUser.id,
          email: tempUser.email,
          username: tempUser?.username as string,
        };

        return user;
      },
    }),
  ],
  pages: { error: "/api/auth/error" },
  callbacks: {
    async session({ session }) {
      const users = await serverClient.Users.getUsers();
      const dbUser = users.find((u) => u.email === session.user.email);

      if (!dbUser) {
        throw new Error("User not found in database");
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username,
        },
      };
    },
  },
});
