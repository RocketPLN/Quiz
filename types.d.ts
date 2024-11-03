declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username: string;
  }
}
