
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function MyEnrollments() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEnrolledCourses() {
      try {
        const data = await apiRequest(
          "/api/course/my-enrollments"
        );
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEnrolledCourses();
  }, []);

  return (
    <main className="container">
      <h2>My Enrollments</h2>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && courses.length === 0 && (
        <p>You have not enrolled in any courses.</p>
      )}

      <div className="course-grid">
        {courses.map((course) => (
          <article className="panel" key={course._id}>
            <h3>{course.courseName}</h3>
            <p>Duration: {course.duration} days</p>
            <p>Price: {course.price}</p>
            <p>Status: {course.status}</p>

            <Link
              className="button-link"
              to={`/course/${course._id}`}
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
