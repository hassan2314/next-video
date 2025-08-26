"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { data, status } = useSession();
  const session = data; // clarity ke liye rename
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/videos", label: "Videos" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyVideoApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-blue-600 transition ${
                pathname === href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {session?.session?.user?.name || "User"}
              </span>
              {console.log(session?.expires)}
              <button
                onClick={() => signOut()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm font-medium text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm font-medium text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1 rounded-lg text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none text-gray-700"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block hover:text-blue-600 transition ${
                pathname === href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="mt-3">
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
