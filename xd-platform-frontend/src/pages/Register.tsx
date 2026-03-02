import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden bg-black text-white md:grid-cols-2">
      {/* LEFT: FORM (centered) */}
      <div className="flex items-center justify-center px-8 md:pl-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-semibold">
            Sign up to <span className="font-bold tracking-wide text-lime-400">XD</span>
          </h1>

          {error && (
            <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const password = (form.elements.namedItem("password") as HTMLInputElement).value;
              const username = email.split("@")[0]; // derive username from email
              try {
                await register(email, password, username);
                navigate("/", { replace: true });
              } catch (err: any) {
                setError(err.message || "Registration failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tangxd@gmail.com"
                required
                className="w-full rounded-md border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-md border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-md bg-lime-400 py-2 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-3 text-xs text-gray-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-lime-400 hover:underline">
              Log in
            </Link>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            <span>OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-[#141414] px-3 py-2 text-sm text-gray-100 transition hover:bg-[#1d1d1d]">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span>Continue with Google</span>
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-[#141414] px-3 py-2 text-sm text-gray-100 transition hover:bg-[#1d1d1d]">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span>Continue with Steam</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <Link to="/" className="text-lime-400 hover:underline">Return to Home</Link>
          </div>
        </div>
      </div>

      {/* RIGHT: LOGO IMAGE (no cropping, aligned right) */}
      <div className="hidden h-full items-stretch overflow-hidden bg-black md:flex">
        <img
          src="/images/auth/xd-big-logo.svg"
          alt="XD Platform"
          className="h-full w-full object-contain object-right"
        />
      </div>
    </div>
  );
};

export default Register;
