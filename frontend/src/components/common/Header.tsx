import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <div>
        <h1>AI Document Studio</h1>
        <p>Generate, refine, and export Gemini-powered deliverables.</p>
      </div>
      <nav>
        {token ? (
          <>
            <Link to="/dashboard" className="secondary">
              Dashboard
            </Link>
            <button className="secondary" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : null}
      </nav>
    </header>
  );
}


