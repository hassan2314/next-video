"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

import Link from "next/link";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      signIn("credentials", { email, password });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
        {/* --- Sign Up Form --- */}
        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Sign Up
          </h1>

          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={confirmPasswordHandler}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* --- Social Login Buttons --- */}
        <button
          className="w-full py-2 border border-gray-300 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
          onClick={() => signIn("google")}
        >
          <img src="/Google_Icon.png" alt="Google" className="w-5 h-5" />
          Sign In with Google
        </button>

        <button
          className="w-full py-2 border border-gray-300 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
          onClick={() => signIn("github")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="GitHub"
            className="w-5 h-5"
          />
          Sign In with GitHub
        </button>
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link className="text-blue-500 hover:underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
