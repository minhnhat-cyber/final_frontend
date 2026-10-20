
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useUser } from "./context/user-context";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import MyEnrollments from "./pages/MyEnrollments";

function HomeRedirect() {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "Teacher") {
    return <Navigate to="/teacher" replace />;
  }

  if (user.role === "Student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  const { loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />

        {/* Teacher Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["Teacher"]} />}
        >
          <Route
            path="/teacher"
            element={<TeacherDashboard />}
          />
          <Route
            path="/teacher/course/new"
            element={<CourseForm />}
          />
          <Route
            path="/teacher/course/:courseId/edit"
            element={<CourseForm />}
          />
        </Route>

        {/* Student Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["Student"]} />}
        >
          <Route
            path="/student"
            element={<StudentDashboard />}
          />
          <Route
            path="/student/enrollments"
            element={<MyEnrollments />}
          />
        </Route>

        {/* Shared Course Detail */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Teacher", "Student"]}
            />
          }
        >
          <Route
            path="/course/:courseId"
            element={<CourseDetail />}
          />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </HashRouter>
  );
}

