
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/user-context";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <header className="navbar">
      <h2>Online Course Service</h2>

      <nav>
        {user.role === "Teacher" && (
          <Link to="/teacher">My Courses</Link>
        )}

        {user.role === "Student" && (
          <>
            <Link to="/student">All Courses</Link>
            <Link to="/student/enrollments">
              My Enrollments
            </Link>
          </>
        )}

        <span>{user.username} ({user.role})</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

