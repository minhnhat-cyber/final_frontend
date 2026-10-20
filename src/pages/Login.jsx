
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/user-context";

export default function Login() {
  const { user, login } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(username.trim(), password);

      navigate(
        loggedInUser.role === "Teacher"
          ? "/teacher"
          : "/student",
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "Teacher" ? "/teacher" : "/student"}
        replace
      />
    );
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Welcome back</h1>

        <p className="login-subtitle">
          Sign in to your Online Course Service account.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              Username or Email
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username or email"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
