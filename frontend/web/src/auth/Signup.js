import { useState } from "react";
import { createUser } from "../api/backend";

function Signup({ onSuccess }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const user = await createUser(name);
      localStorage.setItem("user_id", user.id);
      onSuccess(user);
    } catch (e) {
      setError("Failed to create user");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup}>Create Account</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Signup;
