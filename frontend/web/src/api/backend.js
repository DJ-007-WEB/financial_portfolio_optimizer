const BASE_URL = "http://localhost:8000";

/**
 * USERS
 */
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const createUser = async (name) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

/**
 * RISK PROFILE
 */
export const createRiskProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/risk_profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getRiskProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/risk_profile/${userId}`);
  return res.json();
};

/**
 * PORTFOLIO
 */
export const optimizePortfolio = async (userId, symbols) => {
  const res = await fetch(`${BASE_URL}/portfolio/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      symbols: symbols,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to optimize portfolio");
  }

  return res.json();
};

