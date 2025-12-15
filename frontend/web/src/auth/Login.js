import { useState } from "react";
import { getUsers } from "../api/backend";

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const users = await getUsers(); // users is an ARRAY ✅

      const user = users.find(
        (u) => String(u.id) === userId.trim()
      );

      if (!user) {
        setError("User not found");
        return;
      }

      onLogin(user); // ✅ works now
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <>
      <h2>Welcome Back</h2>

      <input
        type="number"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" onClick={handleLogin}>
        Login
      </button>
    </>
  );
}
