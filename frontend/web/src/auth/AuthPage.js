import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">Financial Portfolio Optimizer</h1>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" ? (
          <Login onLogin={onLogin} />
        ) : (
          <Signup onLogin={onLogin} />
        )}
      </div>
    </div>
  );
}
