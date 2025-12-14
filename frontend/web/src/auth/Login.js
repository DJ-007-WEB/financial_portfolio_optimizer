import { useEffect, useState } from "react";
import { getUsers } from "../api/backend";

function Login({ onSuccess }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users || []))
      .catch(() => setError("Failed to load users"));
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("user_id", user.id);
    onSuccess(user);
  };

  return (
    <div>
      <h2>Login</h2>

      {users.map((user) => (
        <div key={user.id}>
          <button onClick={() => handleLogin(user)}>
            Login as {user.name}
          </button>
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
