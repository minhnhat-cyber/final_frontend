
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/user-context";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

