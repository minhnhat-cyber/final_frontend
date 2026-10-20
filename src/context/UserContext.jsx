
import { useEffect, useState } from "react";
import { UserContext } from "./user-context";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();

          if (!cancelled) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(username, password) {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUser(data.user);
    return data.user;
  }

  async function logout() {
    const response = await fetch(
      `${API_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    setUser(null);
  }

  return (
    <UserContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
