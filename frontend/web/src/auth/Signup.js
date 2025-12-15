import { useState } from "react";
import { createUser } from "../api/backend";

const USER_ID_PATTERN = /^(?=.*[0-9])(?=.*[!@#$%^&*._-])(?=.*[a-z])[a-z0-9!@#$%^&*._-]{5,20}$/;

export default function Signup({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }
    if (!USER_ID_PATTERN.test(userId.trim())) {
      setError(
        "User ID: 5-20 chars, lowercase, 1 digit & 1 special (!@#$%^&*._-)"
      );
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const user = await createUser(userId.trim(), name, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <>
      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Choose a user ID (lowercase, digit, special)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" onClick={handleSignup}>
        Create Account
      </button>
    </>
  );
}
