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

export const createUser = async (userId, name, password) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, name, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create user");
  }
  return res.json();
};

export const loginUser = async (userId, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Invalid credentials");
  }

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
   WALLET / HOLDINGS
========================= */

export const getWallet = async (userId) => {
  const res = await fetch(`${BASE_URL}/wallet/${userId}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch wallet");
  }
  return res.json();
};

/* =========================
   MARKET DATA
========================= */

export const getMarketQuote = async (symbol) => {
  const res = await fetch(`${BASE_URL}/market/${symbol}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch market data");
  }
  return res.json();
};

export const depositToWallet = async (userId, amount) => {
  const res = await fetch(`${BASE_URL}/wallet/${userId}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add balance");
  }

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
    let message = "Portfolio optimization failed";
    try {
      const parsed = JSON.parse(errorText);
      message = parsed.detail || message;
    } catch {
      message = errorText || message;
    }
    throw new Error(message);
  }

  return res.json();
};
