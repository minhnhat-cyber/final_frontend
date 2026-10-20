
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCourses(keyword = "") {
    setLoading(true);

    try {
      const query = new URLSearchParams();

      if (keyword.trim()) {
        query.set("search", keyword.trim());
      }

      const data = await apiRequest(
        `/api/course?${query.toString()}`
      );

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

    async function fetchInitialCourses() {
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

    fetchInitialCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container">
      <h2>Available Courses</h2>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          loadCourses(search);
        }}
      >
        <input
          placeholder="Search course or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && <p>Loading courses...</p>}

      {!loading && courses.length === 0 && !error && (
        <p>No courses found.</p>
      )}

      <div className="course-grid">
        {courses.map((course) => (
          <article key={course._id} className="panel">
            <h3>{course.courseName}</h3>

            <p>Teacher: {course.teacherName || "N/A"}</p>
            <p>Duration: {course.duration} days</p>
            <p>Topics: {course.topics?.join(", ")}</p>
            <p>Price: {course.price}</p>
            <p>Status: {course.status}</p>
            <p>Max Students: {course.maxStudent}</p>

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
