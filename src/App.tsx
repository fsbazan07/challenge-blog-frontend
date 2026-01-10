import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./features/layout/components/Layout";

import Feed from "./pages/Feed";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
