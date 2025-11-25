import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function LoginForm({ onShowRegister }: { onShowRegister?: () => void }) {
  const { login, loading, status, setStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      setLocalError((error as Error).message || "Sign in failed");
    }
  };

  return (
    <div className="ocean-login-container">
      <form onSubmit={handleSubmit} className="ocean-login-panel">
        <div className="ocean-login-title">SIGN IN</div>
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="ocean-login-options">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>
        </div>
        <button type="submit" disabled={loading} className="ocean-login-btn">
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
        <div className="ocean-login-new">
          Don&apos;t have an account?{' '}
          <a
            href="#"
            className="ocean-login-link"
            onClick={e => {
              e.preventDefault();
              if (onShowRegister) onShowRegister();
            }}
          >
            Create one
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


