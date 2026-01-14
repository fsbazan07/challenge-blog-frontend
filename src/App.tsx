import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./features/layout/components/Layout";

import Feed from "./pages/Feed";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginLayout from "./features/layout/components/LoginLayout";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./routes/ProtectedRoute";
import PostDetail from "./pages/PostDetail";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/posts/:id" element={<PostDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myposts/new" element={<CreatePost />} />
          <Route path="/myposts/:id/edit" element={<CreatePost />} />
        </Route>
      </Route>
    </Routes>
  );
}
