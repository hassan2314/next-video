import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }
}
