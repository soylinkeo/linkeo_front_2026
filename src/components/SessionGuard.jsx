
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_EXPIRED_EVENT } from "../context/AuthContext";

export default function SessionGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpired = () => {
      navigate("/login", {
        replace: true,
        state: { sessionExpired: true }, // opcional: mostrar aviso en el login
      });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [navigate]);

  return null; // no renderiza nada
}
