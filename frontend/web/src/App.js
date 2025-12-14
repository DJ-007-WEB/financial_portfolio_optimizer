import { useState } from "react";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Dashboard from "./dashboard/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Financial Portfolio Optimizer</h1>

        <Signup onSuccess={setUser} />
        <hr />
        <Login onSuccess={setUser} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Dashboard user={user} />
    </div>
  );
}

export default App;
