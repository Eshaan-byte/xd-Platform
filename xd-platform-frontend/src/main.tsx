// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GameDetails from "./pages/GameDetails";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Categories from "./pages/Categories";
import Community from "./pages/Community";
import CommunityPost from "./pages/CommunityPost";

import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";

import "./index.css";

const router = createBrowserRouter([
  // Pages WITH header/footer
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      // New game details route (dynamic slug)
      { path: "games/:slug", element: <GameDetails /> },
      { path: "categories", element: <Categories /> },
      {
        path: "library",
        element: (
          <RequireAuth>
            <Library />
          </RequireAuth>
        ),
      },
      { path : "community", element: <Community /> },
      { path: "community/:slug", element: <CommunityPost /> },
    ],
  },

  // Auth pages (NO header/footer)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
