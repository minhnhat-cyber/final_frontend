
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCourses() {
    try {
      const data = await apiRequest("/api/course");
      setCourses(data.courses || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      try {
        const data = await apiRequest("/api/course");

        if (!cancelled) {
          setCourses(data.courses || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  async function deleteCourse(id) {
    if (!window.confirm("Delete this course?")) {
      return;
    }

    try {
      await apiRequest(`/api/course/${id}`, {
        method: "DELETE",
      });

      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <div className="section-heading">
        <h2>My Courses</h2>

        <Link
          className="button-link"
          to="/teacher/course/new"
        >
          Create Course
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p>Loading courses...</p>}

      {!loading && courses.length === 0 && !error && (
        <p>No courses found. Create your first course.</p>
      )}

      <div className="course-grid">
        {courses.map((course) => {
          const enrolledCount =
            course.enrolledStudents?.length || 0;

          return (
            <article className="panel" key={course._id}>
              <h3>{course.courseName}</h3>

              <p>Status: {course.status}</p>
              <p>Duration: {course.duration} days</p>
              <p>Topics: {course.topics?.join(", ")}</p>
              <p>Price: {course.price}</p>
              <p>
                Students: {enrolledCount}/{course.maxStudent}
              </p>

              <div className="actions">
                <Link
                  className="button-link"
                  to={`/course/${course._id}`}
                >
                  Details
                </Link>

                <Link
                  className="button-link secondary"
                  to={`/teacher/course/${course._id}/edit`}
                >
                  Edit
                </Link>

                <button
                  className="danger"
                  disabled={enrolledCount > 0}
                  onClick={() => deleteCourse(course._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
