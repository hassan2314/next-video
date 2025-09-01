"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // for eye icons
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // redirect to dashboard/home
      router.push("/");
    }
  };
  return (
    <div className=" bg-gray-50 flex justify-center py-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
        {/* --- Login Form --- */}
        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with Eye Toggle */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

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
          <img
            src="/Google_Icon.png"
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5"
          />
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
          Don’t have an account?{" "}
          <Link className="text-blue-500 hover:underline" href="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
