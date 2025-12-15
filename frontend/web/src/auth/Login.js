import { useState } from "react";
import { loginUser } from "../api/backend";

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter user ID and password");
      return;
    }

    try {
      const user = await loginUser(userId.trim(), password);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <>
      <h2>Welcome Back</h2>

      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" onClick={handleLogin}>
        Login
      </button>
    </>
  );
}
