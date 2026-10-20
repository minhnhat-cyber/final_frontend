
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../context/user-context";
import { apiRequest } from "../lib/api";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useUser();

  const [course, setCourse] = useState(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiRequest(`/api/course/${courseId}`);
        setCourse(data.course);

        if (user.role === "Student") {
          const enrolledData = await apiRequest(
            "/api/course/my-enrollments"
          );

          setAlreadyEnrolled(
            enrolledData.courses.some((c) => c._id === courseId)
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [courseId, user.role]);

  async function handleEnroll() {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await apiRequest(`/api/course/${courseId}/enroll`, {
        method: "POST",
      });

      setAlreadyEnrolled(true);
      setMessage("Enrollment successful");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="container">Loading course...</main>;
  }

  if (!course) {
    return (
      <main className="container">
        <p className="error">{error || "Course not found"}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="panel">
        <h2>{course.courseName}</h2>

        <p>Duration: {course.duration} days</p>
        <p>Topics: {course.topics?.join(", ")}</p>
        <p>Price: {course.price}</p>
        <p>Maximum Students: {course.maxStudent}</p>
        <p>Status: {course.status}</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {user.role === "Student" && (
          <div className="actions">
            <button
              disabled={
                submitting ||
                alreadyEnrolled ||
                course.status !== "Open" ||
                course.availableSeats === 0
              }
              onClick={handleEnroll}
            >
              {alreadyEnrolled
                ? "Already Enrolled"
                : course.status !== "Open"
                  ? "Enrollment Closed"
                  : course.availableSeats === 0
                    ? "Course Full"
                    : submitting
                      ? "Enrolling..."
                      : "Enroll"}
            </button>

            <Link className="button-link secondary" to="/student">
              Back
            </Link>
          </div>
        )}

        {user.role === "Teacher" && (
          <>
            <h3>Enrolled Students</h3>

            {course.enrolledStudents?.length > 0 ? (
              <ul>
                {course.enrolledStudents.map((student) => (
                  <li key={student._id}>
                    {student.username} â€” {student.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled.</p>
            )}

            <div className="actions">
              <Link
                className="button-link"
                to={`/teacher/course/${courseId}/edit`}
              >
                Edit Course
              </Link>
              <Link
                className="button-link secondary"
                to="/teacher"
              >
                Back
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

