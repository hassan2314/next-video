"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>

      <button
        onClick={() => signIn("github")}
        className="p-2 border rounded mb-2"
      >
        Sign in with GitHub
      </button>

      <button
        onClick={() => signIn("google")}
        className="p-2 border rounded mb-2"
      >
        Sign in with Google
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
          const password = (e.currentTarget.elements[1] as HTMLInputElement)
            .value;
          signIn("credentials", { email, password, redirect: true });
        }}
        className="flex flex-col gap-2"
      >
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="p-2 border rounded">
          Sign in with Credentials
        </button>
      </form>
    </div>
  );
}
