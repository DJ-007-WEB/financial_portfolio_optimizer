import { useState } from "react";
import { createUser } from "../api/backend";

export default function Signup({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const user = await createUser(name);
      onLogin(user); // ✅ FIXED
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <>
      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" onClick={handleSignup}>
        Create Account
      </button>
    </>
  );
}
