import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black text-white">
    <div className="text-center space-y-3">
      <h1 className="text-2xl font-bold">404 — Page not found</h1>
      <Link to="/" className="text-lime-400 hover:underline">Go home</Link>
    </div>
  </div>
);

export default NotFound;
