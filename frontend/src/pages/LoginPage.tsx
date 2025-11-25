import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="grid">
      {!showRegister ? (
        <LoginForm onShowRegister={() => setShowRegister(true)} />
      ) : (
        <RegisterForm onShowLogin={() => setShowRegister(false)} />
      )}
    </div>
  );
}

