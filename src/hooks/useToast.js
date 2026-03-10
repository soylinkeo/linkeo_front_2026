// src/hooks/useToast.js
import { useState, useCallback, useRef } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, type, title, message, leaving: false }]);

    setTimeout(() => {
      // Mark as leaving (trigger exit animation)
      setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
      // Remove after animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 350);
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 350);
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  return { toasts, toast, dismiss };
}
