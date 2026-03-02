import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-20 pt-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
