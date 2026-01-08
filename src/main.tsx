import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import AppShell from "./layouts/AppShell";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <Feed /> },
      { path: "/posts/:id", element: <PostDetail /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/me", element: <Profile /> },
      { path: "/me/posts", element: <MyPosts /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/reports", element: <AdminReports /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
