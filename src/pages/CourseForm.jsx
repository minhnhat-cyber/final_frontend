
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

const initialForm = {
  courseName: "",
  duration: 1,
  topics: "",
  price: 0,
  maxStudent: 1,
  status: "Open",
};

export default function CourseForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(courseId);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    async function loadCourse() {
      try {
        const data = await apiRequest(`/api/course/${courseId}`);

        setForm({
          courseName: data.course.courseName,
          duration: data.course.duration,
          topics: data.course.topics.join(", "),
          price: data.course.price,
          maxStudent: data.course.maxStudent,
          status: data.course.status,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  function change(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      courseName: form.courseName.trim(),
      duration: Number(form.duration),
      topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean),
      price: Number(form.price),
      maxStudent: Number(form.maxStudent),
      status: form.status,
    };

    try {
      await apiRequest(
        editing ? `/api/course/${courseId}` : "/api/course",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      navigate("/teacher");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="container">Loading...</main>;

  return (
    <main className="container">
      <form className="panel course-form" onSubmit={handleSubmit}>
        <h2>{editing ? "Edit Course" : "Create Course"}</h2>

        {error && <p className="error">{error}</p>}

        <label>Course Name</label>
        <input
          value={form.courseName}
          onChange={(e) => change("courseName", e.target.value)}
          required
        />

        <label>Duration (days)</label>
        <input
          type="number"
          min="1"
          value={form.duration}
          onChange={(e) => change("duration", e.target.value)}
          required
        />

        <label>Topics (comma separated)</label>
        <input
          value={form.topics}
          onChange={(e) => change("topics", e.target.value)}
          required
        />

        <label>Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => change("price", e.target.value)}
          required
        />

        <label>Max Students</label>
        <input
          type="number"
          min="1"
          value={form.maxStudent}
          onChange={(e) => change("maxStudent", e.target.value)}
          required
        />

        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) => change("status", e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="Close">Close</option>
          <option value="Cancel">Cancel</option>
        </select>

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Course"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/teacher")}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
