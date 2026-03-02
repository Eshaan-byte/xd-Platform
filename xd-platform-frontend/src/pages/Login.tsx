import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Input = ({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-xs font-semibold tracking-wide text-gray-300">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
    />
  </div>
);

const SocialButton = ({
  dotClass,
  children,
}: {
  dotClass: string;
  children: React.ReactNode;
}) => (
  <button className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-[#141414] px-3 py-2 text-sm text-gray-100 transition hover:bg-[#1d1d1d]">
    <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
    <span>{children}</span>
  </button>
);

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden bg-black text-white md:grid-cols-2">
      {/* LEFT: FORM */}
      <div className="flex items-center justify-center px-8 md:pl-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-semibold">Log in</h1>

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
              try {
                await login(email, password);
                navigate(redirectTo, { replace: true });
              } catch (err: any) {
                setError(err.message || "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input id="email" label="Email address" type="email" placeholder="tangxd@gmail.com" />
            <Input id="password" label="Password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-lime-400 py-2 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <a href="#" className="hover:text-gray-200">
              Forgot password?
            </a>
            <Link to="/register" className="hover:text-gray-200">
              Create account
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
            <SocialButton dotClass="bg-green-400">Continue with Google</SocialButton>
            <SocialButton dotClass="bg-purple-500">Continue with Steam</SocialButton>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <Link to="/" className="text-lime-400 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT: HERO IMAGE (no crop, aligned right) */}
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

export default Login;
