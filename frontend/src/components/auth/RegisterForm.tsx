import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

export function RegisterForm({ onShowLogin }: { onShowLogin?: () => void }) {
  const { register, loading, status, setStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    setLocalError("");

    // Validation
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (!password.trim()) {
      setLocalError("Password is required");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await register({ email: email.trim(), password });
      setLocalError("");
      if (onShowLogin) onShowLogin();
    } catch (error) {
      setLocalError((error as Error).message || "Registration failed");
    }
  };

  return (
    <div className="ocean-login-container">
      <form onSubmit={handleSubmit} className="ocean-login-panel">
        <div className="ocean-login-title">CREATE ACCOUNT</div>
        <div className="ocean-login-row">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="ocean-login-row">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </div>
        <div className="ocean-login-row">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="ocean-login-btn">
          {loading ? "Creating..." : "REGISTER"}
        </button>
        <div className="ocean-login-new">
          Already have an account?{' '}
          <a
            href="#"
            className="ocean-login-link"
            onClick={e => {
              e.preventDefault();
              if (onShowLogin) onShowLogin();
            }}
          >
            Sign in
          </a>
        </div>
        {localError && <p className="status error">{localError}</p>}
        {status && <p className="status">{status}</p>}
      </form>
      <div className="ocean-login-footer">
        © 2025 OCEAN.AI — All rights reserved
      </div>
    </div>
  );
}


