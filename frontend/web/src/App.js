import { useState } from "react";

import AuthPage from "./auth/AuthPage";
import Dashboard from "./dashboard/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  const [user, setUser] = useState(null);

  // If user is not logged in → show Auth
  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  // Logged-in experience → wrapped inside layout
  return (
    <DashboardLayout>
      <Dashboard user={user} />
    </DashboardLayout>
  );
}

export default App;
