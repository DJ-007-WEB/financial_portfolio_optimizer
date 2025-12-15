const BASE_URL = "http://localhost:8000";

/* =========================
   USERS
========================= */

/* USERS */

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const createUser = async (name) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};


/* =========================
   RISK PROFILE
========================= */

export const createRiskProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/risk_profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create risk profile");
  return res.json();
};

export const getRiskProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/risk_profile/${userId}`);
  if (!res.ok) throw new Error("Risk profile not found");
  return res.json();
};

/* =========================
   PORTFOLIO OPTIMIZATION
========================= */

export const optimizePortfolio = async (userId, symbols) => {
  const payload = {
    user_id: userId,
    symbols: symbols, // MUST be array ["RELIANCE"]
  };

  const res = await fetch(`${BASE_URL}/portfolio/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Optimize error:", errorText);
    throw new Error("Portfolio optimization failed");
  }

  return res.json();
};
