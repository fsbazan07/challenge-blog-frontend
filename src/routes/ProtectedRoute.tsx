import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthService } from "@/services/auth/auth.service";

type Props = {
  redirectTo?: string;
};

export default function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const location = useLocation();

  const isAuthed = AuthService.isAuthenticated();

  if (!isAuthed) {
    return (
      <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
