"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Call your backend API
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessage("Password reset link has been sent to your email.");
        setTimeout(() => {
          router.push("/reset-password");
        });
      }
    } catch (err) {
      setError("Failed to send reset link. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center bg-gray-50 py-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Forgot Password
          </h1>

          <p className="text-sm text-gray-600 text-center">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Remembered your password?{" "}
          <Link className="text-blue-500 hover:underline" href="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
