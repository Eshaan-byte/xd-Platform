import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isCommunity = path.startsWith("/community");
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-black text-white">
      
      {/* TOP BAR */}
      <div className="border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              alt="XD Logo"
              className="h-6 w-auto"
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            {/* Globe */}
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
              🌐
            </button>

            {/* Login / Logout */}
            {isAuthed ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-gray-200 hover:border-white/40"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-gray-200 hover:border-white/40"
              >
                LOGIN
              </Link>
            )}

            {/* Download */}
            <button className="rounded-full bg-lime-400 px-4 py-1.5 text-sm font-semibold text-black hover:bg-lime-300">
              DOWNLOAD
            </button>

          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className="border-b border-white/5 bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-7xl items-center gap-10 px-6 py-3">

          {/* Search */}
          <form
            className="relative flex-1 max-w-xs"
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                navigate(`/categories?search=${encodeURIComponent(search.trim())}`);
              }
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-[#171717] py-2 pl-9 pr-3 text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Search games..."
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              🔍
            </span>
          </form>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm text-gray-300">

            {/* HOME */}
            <Link
              to="/"
              className={`px-3 py-1 rounded-full transition
                ${path === "/" ? "bg-white text-black font-semibold" : "hover:text-white"}
              `}
            >
              HOME
            </Link>

            {/* CATEGORIES */}
            <Link
              to="/categories"  
              className={`px-3 py-1 rounded-full transition
                ${path === "/categories" ? "bg-white text-black font-semibold" : "hover:text-white"}
              `}
            >
              CATEGORIES
            </Link>

            {/* LIBRARY (only when logged in) */}
            {isAuthed && (
              <Link
                to="/library"
                className={`px-3 py-1 rounded-full transition
                  ${path === "/library" ? "bg-white text-black font-semibold" : "hover:text-white"}
                `}
              >
                LIBRARY
              </Link>
            )}

            {/* COMMUNITY */}
            <Link
              to="/community"
              className={`px-3 py-1 rounded-full transition
                ${isCommunity ? "bg-white text-black font-semibold" : "hover:text-white"}
              `}
            >
              COMMUNITY
            </Link>
            
          </nav>
        </div>
      </div>

    </header>
  );
};

export default Header;
