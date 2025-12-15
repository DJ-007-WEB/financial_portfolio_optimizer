import { useState } from "react";

import AuthPage from "./auth/AuthPage";
import Dashboard from "./dashboard/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveSection("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection("dashboard");
  };

  // If user is not logged in → show Auth
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Logged-in experience → wrapped inside layout
  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      onNavigate={setActiveSection}
      activeSection={activeSection}
    >
      <Dashboard
        user={user}
        activeSection={activeSection}
      />
    </DashboardLayout>
  );
}

export default App;
