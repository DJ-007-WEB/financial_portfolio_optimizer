import { useState } from "react";
import "./TopBar.css";
import { getWallet, depositToWallet } from "../api/backend";

export default function TopBar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [depositing, setDepositing] = useState(false);

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  const fetchWallet = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getWallet(user.id);
      setWallet(data);
    } catch (err) {
      setError(err.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const toggleProfile = async () => {
    const next = !open;
    setOpen(next);
    if (next && !wallet) {
      await fetchWallet();
    }
  };

  const handleDeposit = async () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setDepositing(true);
    setError("");
    try {
      await depositToWallet(user.id, parsed);
      setAmount("");
      await fetchWallet();
    } catch (err) {
      setError(err.message || "Failed to add balance");
    } finally {
      setDepositing(false);
    }
  };

  return (
    <header className="topbar">
      <h1>Dashboard</h1>

      <div
        className="user-info"
        title={user?.user_id ? `User ID: ${user.user_id}` : "Profile"}
      >
        <span>Hello, {user?.name || "Investor"}</span>
        <div
          className="avatar"
          onClick={toggleProfile}
          style={{ cursor: "pointer" }}
          role="button"
        >
          {initial}
        </div>

        {open && (
          <div className="profile-panel">
            <div className="profile-header">
              <div className="avatar">{initial}</div>
              <div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-meta">User ID: {user?.user_id}</div>
              </div>
            </div>

            {loading ? (
              <p className="profile-meta">Loading wallet...</p>
            ) : (
              <>
                <div className="profile-balance">
                  <span>Available Balance</span>
                  <span>₹ {Number(wallet?.balance || 0).toFixed(2)}</span>
                </div>

                <div className="profile-holdings">
                  {wallet?.holdings?.length ? (
                    wallet.holdings.map((h) => (
                      <div className="holding-row" key={h.symbol}>
                        <span>{h.symbol}</span>
                        <span>{h.quantity} units</span>
                      </div>
                    ))
                  ) : (
                    <p className="profile-meta">No holdings yet</p>
                  )}
                </div>

                <div className="profile-actions">
                  <input
                    className="add-balance-input"
                    type="number"
                    placeholder="Add balance"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button
                    className="add-balance-btn"
                    onClick={handleDeposit}
                    disabled={depositing}
                  >
                    {depositing ? "Adding..." : "Add"}
                  </button>
                </div>

                {error && (
                  <p className="profile-meta" style={{ color: "var(--danger)" }}>
                    {error}
                  </p>
                )}

                <div className="profile-footer">
                  <button onClick={onLogout}>Logout</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
