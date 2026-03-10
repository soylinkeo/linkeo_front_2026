// src/lib/api.js
const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:4000";

// ---------- Storage helpers
function readJSON(storage, key) {
  try { const v = storage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function writeJSON(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); } catch {}
}
function del(storage, key) {
  try { storage.removeItem(key); } catch {}
}

const KEYS = {
  tokens:  "auth.tokens",
  user:    "auth.user",
  profile: "auth.profile",
  remember:"auth.remember",
};

function currentStorage() {
  return localStorage.getItem(KEYS.remember) === "session"
    ? sessionStorage
    : localStorage;
}

export const tokenStore = {
  get() {
    return readJSON(localStorage, KEYS.tokens) || readJSON(sessionStorage, KEYS.tokens);
  },
  set(tokens, remember = true) {
    del(localStorage,   KEYS.tokens);
    del(sessionStorage, KEYS.tokens);
    if (remember) {
      localStorage.setItem(KEYS.remember, "local");
      writeJSON(localStorage, KEYS.tokens, tokens);
    } else {
      localStorage.setItem(KEYS.remember, "session");
      writeJSON(sessionStorage, KEYS.tokens, tokens);
    }
    // 🔑 Notificar al AuthContext que los tokens cambiaron
    _onTokensRefreshed?.(tokens);
  },
  clear() {
    del(localStorage,   KEYS.tokens);
    del(sessionStorage, KEYS.tokens);
    del(localStorage,   KEYS.remember);
    _onTokensRefreshed?.(null);
  },
};

export const userStore = {
  get() { return readJSON(localStorage, KEYS.user) || readJSON(sessionStorage, KEYS.user); },
  set(user, remember = null) {
    const stor = remember === null ? currentStorage() : remember ? localStorage : sessionStorage;
    del(localStorage, KEYS.user); del(sessionStorage, KEYS.user);
    writeJSON(stor, KEYS.user, user);
  },
  clear() { del(localStorage, KEYS.user); del(sessionStorage, KEYS.user); },
};

export const profileStore = {
  get() { return readJSON(localStorage, KEYS.profile) || readJSON(sessionStorage, KEYS.profile); },
  set(profile, remember = null) {
    const stor = remember === null ? currentStorage() : remember ? localStorage : sessionStorage;
    del(localStorage, KEYS.profile); del(sessionStorage, KEYS.profile);
    writeJSON(stor, KEYS.profile, profile);
  },
  clear() { del(localStorage, KEYS.profile); del(sessionStorage, KEYS.profile); },
};

// ---------- Callback que el AuthContext registra para sincronizar su estado
let _onTokensRefreshed = null;
export function setOnTokensRefreshed(fn) {
  _onTokensRefreshed = fn;
}

// ---------- fetch helpers
async function fetchJSON(url, init = {}) {
  const r = await fetch(url, init);
  const ct = r.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await r.json() : await r.text();
  if (!r.ok) {
    const msg = typeof data === "string" ? data : data?.message || r.statusText;
    throw new Error(msg || `HTTP ${r.status}`);
  }
  return data;
}

// Evita múltiples refresh en paralelo
let _refreshPromise = null;

async function refreshTokens() {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const rt = tokenStore.get()?.refreshToken;
    if (!rt) throw new Error("No refresh token");

    const data = await fetchJSON(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });

    const remember = (localStorage.getItem(KEYS.remember) || "local") === "local";
    // tokenStore.set ya llama a _onTokensRefreshed → AuthContext se actualiza
    tokenStore.set(
      { accessToken: data.accessToken, refreshToken: data.refreshToken },
      remember
    );

    return data;
  })();

  try {
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

export async function authFetch(path, init = {}) {
  const tryOnce = async () => {
    const at = tokenStore.get()?.accessToken;
    const headers = new Headers(init.headers || {});
    if (at) headers.set("Authorization", `Bearer ${at}`);
    if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
    return fetch(`${API_BASE}${path}`, { ...init, headers });
  };

  let res = await tryOnce();

  if (res.status === 401) {
    try {
      await refreshTokens();
      res = await tryOnce(); // reintento con nuevo token
    } catch {
      // Refresh falló → limpiar sesión
      tokenStore.clear();
      userStore.clear();
      profileStore.clear();
      throw new Error("Sesión expirada. Por favor vuelve a iniciar sesión.");
    }
  }

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.message || res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

// ---------- Silent refresh proactivo
// Decodifica el JWT sin verificar firma (solo para leer exp en cliente)
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return null; }
}

let _silentRefreshTimer = null;

export function scheduleSilentRefresh() {
  if (_silentRefreshTimer) clearTimeout(_silentRefreshTimer);

  const at = tokenStore.get()?.accessToken;
  if (!at) return;

  const payload = decodeJwtPayload(at);
  if (!payload?.exp) return;

  const expiresInMs = payload.exp * 1000 - Date.now();
  // Refrescar 60 segundos ANTES de que expire
  const refreshInMs = Math.max(expiresInMs - 60_000, 0);

  _silentRefreshTimer = setTimeout(async () => {
    try {
      await refreshTokens();
      scheduleSilentRefresh(); // reprogramar con el nuevo token
    } catch {
      // refresh falló — AuthContext se enterará por _onTokensRefreshed(null)
    }
  }, refreshInMs);
}

export function cancelSilentRefresh() {
  if (_silentRefreshTimer) { clearTimeout(_silentRefreshTimer); _silentRefreshTimer = null; }
}

// ---------- API
export const API = {
  login({ user, pass }) {
    return fetchJSON(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
  },
  register({ username, email, password }) {
    return fetchJSON(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  },
  async logout(refreshToken) {
    try {
      await fetchJSON(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {}
  },
  getPublicBySlug(slug) {
    if (!slug) throw new Error("slug requerido");
    return fetchJSON(`${API_BASE}/api/profiles/public/${encodeURIComponent(slug.trim())}`);
  },
  getMeProfile()           { return authFetch(`/api/profiles/me/profile`, { method: "GET" }); },
  upsertMeProfile(payload) { return authFetch(`/api/profiles/me/profile`, { method: "PUT", body: JSON.stringify(payload) }); },
  upsertByUsername(username, payload) {
    if (!username) throw new Error("username requerido");
    return authFetch(`/api/profiles/by-username/${encodeURIComponent(username.trim())}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  getMyNfcLayout()           { return authFetch(`/api/profiles/me/nfc-layout`, { method: "GET" }); },
  upsertMyNfcLayout(payload) { return authFetch(`/api/profiles/me/nfc-layout`, { method: "PUT", body: JSON.stringify(payload) }); },
};