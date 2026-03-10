// src/context/AuthContext.jsx
import React, {
  createContext, useCallback, useContext,
  useEffect, useMemo, useRef, useState,
} from "react";
import {
  API, tokenStore, userStore, profileStore,
  setOnTokensRefreshed, scheduleSilentRefresh, cancelSilentRefresh,
} from "../lib/api";

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
// Para pruebas: const INACTIVITY_TIMEOUT_MS = 30 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

// Evento global para que App.jsx (dentro del Router) pueda redirigir
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export function AuthProvider({ children }) {
  const [tokens,  setTokens]  = useState(() => tokenStore.get());
  const [user,    setUser]    = useState(() => userStore.get());
  const [profile, setProfile] = useState(() => profileStore.get());

  const inactivityTimerRef = useRef(null);

  // ─── Limpiar sesión (sin navegar — la navegación la hace quien escucha el evento) ──
  const clearSession = useCallback(async (notify = true) => {
    cancelSilentRefresh();
    clearInactivityTimerFn();
    const rt = tokenStore.get()?.refreshToken;
    try { await API.logout(rt); } catch {}
    tokenStore.clear();
    userStore.clear();
    profileStore.clear();
    setTokens(null);
    setUser(null);
    setProfile(null);
    if (notify) {
      // Dispara evento global → App.jsx escucha y redirige a /login
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
  }, []); // eslint-disable-line

  // Necesitamos clearInactivityTimer como función normal para poder usarla arriba
  const inactivityTimerRefLocal = inactivityTimerRef;
  function clearInactivityTimerFn() {
    if (inactivityTimerRefLocal.current) {
      clearTimeout(inactivityTimerRefLocal.current);
      inactivityTimerRefLocal.current = null;
    }
  }

  const clearInactivityTimer = useCallback(() => {
    clearInactivityTimerFn();
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimerFn();
    inactivityTimerRef.current = setTimeout(() => {
      clearSession(true); // true = disparar evento de redirección
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearSession]);

  // Activar listeners solo cuando hay sesión activa
  useEffect(() => {
    if (!tokens?.accessToken || !user) {
      clearInactivityTimerFn();
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      return;
    }

    resetInactivityTimer();
    ACTIVITY_EVENTS.forEach(e =>
      window.addEventListener(e, resetInactivityTimer, { passive: true })
    );

    return () => {
      clearInactivityTimerFn();
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetInactivityTimer));
    };
  }, [tokens?.accessToken, user, resetInactivityTimer]);

  // ─── Sync tokens desde api.js ─────────────────────────────────────────────
  useEffect(() => {
    setOnTokensRefreshed((newTokens) => {
      setTokens(newTokens);
      if (!newTokens) {
        setUser(null);
        setProfile(null);
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
    });
    return () => setOnTokensRefreshed(null);
  }, []);

  // ─── Silent refresh proactivo ─────────────────────────────────────────────
  useEffect(() => {
    if (tokens?.accessToken) scheduleSilentRefresh();
    else cancelSilentRefresh();
    return () => cancelSilentRefresh();
  }, [tokens?.accessToken]);

  const isAuthed = !!tokens?.accessToken && !!user;

  const login = useCallback(async ({ user: u, pass, remember = true }) => {
    const data = await API.login({ user: u, pass });
    const tk = { accessToken: data.accessToken, refreshToken: data.refreshToken };
    tokenStore.set(tk, remember);
    userStore.set(data.user, remember);
    profileStore.set(data.profile || null, remember);
    setTokens(tk);
    setUser(data.user);
    setProfile(data.profile || null);
    return data;
  }, []);

  const register = useCallback(async ({ username, email, password, remember = true }) => {
    const data = await API.register({ username, email, password });
    if (data.pending) return data;
    const tk = { accessToken: data.accessToken, refreshToken: data.refreshToken };
    tokenStore.set(tk, remember);
    userStore.set(data.user, remember);
    profileStore.set(data.profile || null, remember);
    setTokens(tk);
    setUser(data.user);
    setProfile(data.profile || null);
    return data;
  }, []);

  // Logout manual (sin notificar — el usuario ya sabe que se va)
  const logout = useCallback(async () => {
    await clearSession(false);
  }, [clearSession]);

  const setProfileAndPersist = useCallback((p, remember) => {
    const rem = remember ?? (localStorage.getItem("auth.remember") !== "session");
    profileStore.set(p, rem);
    setProfile(p);
  }, []);

  const value = useMemo(() => ({
    tokens, user, profile, isAuthed,
    login, register, logout,
    setProfile: setProfileAndPersist,
  }), [tokens, user, profile, isAuthed, login, register, logout, setProfileAndPersist]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
