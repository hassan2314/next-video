import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import { dbConnect } from "./db";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("No user found with this email");

        // Block login if user signed up with Google/Github
        if (user.provider !== "credentials") {
          throw new Error(
            `This email is registered with ${user.provider}. Use ${user.provider} to login.`
          );
        }

        const isValid = await user.comparePassword(credentials!.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // New user → create in DB

        const newUser = await User.create({
          name: user.name,
          email: user.email,
          provider: account?.provider,
          provider_id: user.id || null,
          image: user.image || null,
        });
        user.id = newUser._id.toString();
        console.log(
          "user id: ",
          user.id,
          "New User id :",
          newUser._id.toString()
        );
        // Allow login
        return true;
      }

      // If email exists with different provider, block login
      if (account?.provider && existingUser.provider !== account.provider) {
        throw new Error(
          `Email already registered with ${existingUser.provider}. Use that provider to login.`
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
