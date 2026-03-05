// src/pages/config/hooks/useProfileConfig.js
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../lib/api";
import { PLATFORMS, PLACEHOLDERS, DEFAULT_PROFILE, FONTS, STYLE_PRESETS } from "../model";
import { isValidUrl, normalizeUrl } from "../utils/url";
import { buildVCard, downloadTextFile } from "../utils/vcard";
import { fromServerDoc, toServerPayload } from "../utils/mappers";
import { Grid } from "../styles";

export default function useProfileConfig() {
  const { user, profile: ctxProfile, setProfile: setCtxProfile, isAuthed } = useAuth();

  const STORAGE_KEY = user?.username ? `social_tiles_theme_v9_${user.username}` : "social_tiles_theme_v9_anon";

  const [items, setItems] = useState(() =>
    PLATFORMS.map((p) => ({ key: p.key, url: "", visible: true, open: false }))
  );
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [errors, setErrors] = useState({});
  const [openStep, setOpenStep] = useState(1);
  const [loadingNet, setLoadingNet] = useState(false);

  // ===== cargar de backend al entrar (si authed)
  useEffect(() => {
    if (!isAuthed) return;
    loadFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  // ===== restaurar borrador local o ctxProfile
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        const savedLinks = Array.isArray(saved) ? saved : Array.isArray(saved?.links) ? saved.links : [];
        const merged = PLATFORMS.map(
          (p) => savedLinks.find((s) => s.key === p.key) || { key: p.key, url: "", visible: true, open: false }
        );
        setItems(merged);
        if (!Array.isArray(saved) && saved?.profile) setProfile((prev) => ({ ...prev, ...saved.profile }));
        return;
      } catch {}
    }

    if (ctxProfile) {
      const mapped = fromServerDoc(ctxProfile);
      setProfile(mapped.profile);
      setItems(mapped.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]);

  // ===== refrescar desde ctxProfile si no hay borrador local
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw && ctxProfile) {
      const mapped = fromServerDoc(ctxProfile);
      setProfile(mapped.profile);
      setItems(mapped.items);
    }
  }, [ctxProfile, STORAGE_KEY]);

  // ===== guardar borrador local
  useEffect(() => {
    const data = {
      links: items.map(({ key, url, visible }) => ({ key, url, visible })),
      profile,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [items, profile, STORAGE_KEY]);

  // ===== Google Font dinámica
  useEffect(() => {
    const def = FONTS.find((f) => f.label === profile.fontFamily);
    const id = "designer-font-link";
    const existing = document.getElementById(id);
    if (!def || !def.css) {
      if (existing) existing.remove();
      return;
    }
    const href = `https://fonts.googleapis.com/css2?family=${def.css}&display=swap`;
    if (existing) existing.setAttribute("href", href);
    else {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    }
  }, [profile.fontFamily]);

  // ===== helpers items
  const byKey = (k) => items.find((i) => i.key === k);

  const toggleOpen = (k) =>
    setItems((prev) => prev.map((i) => (i.key === k ? { ...i, open: !i.open } : { ...i, open: false })));

  const setUrl = (k, url) => setItems((prev) => prev.map((i) => (i.key === k ? { ...i, url } : i)));

  const setVisible = (k, v) => setItems((prev) => prev.map((i) => (i.key === k ? { ...i, visible: v } : i)));

  // ===== visibleLinks para preview/vcard
  const visibleLinks = useMemo(
    () =>
      items
        .filter((i) => i.visible && isValidUrl(i.url))
        .map((i, idx) => ({ ...i, href: normalizeUrl(i.url), order: idx })),
    [items]
  );

  const validateOne = (k) => {
    const i = byKey(k);
    if (!i) return;
    const ok = i.url ? isValidUrl(i.url) : true;
    setErrors((e) => ({ ...e, [k]: ok ? "" : "URL inválida (usa https://, mailto:, tel:, data:)" }));
  };

  // ===== assets (image/pdf)
  const onAvatarFile = (file) => {
    const r = new FileReader();
    r.onload = () => setProfile((p) => ({ ...p, avatarDataUrl: r.result }));
    r.readAsDataURL(file);
  };
  const onBgImageFile = (file) => {
    const r = new FileReader();
    r.onload = () => setProfile((p) => ({ ...p, bgImageDataUrl: r.result, bgMode: "image" }));
    r.readAsDataURL(file);
  };
  const onPdfFile = (file) => {
    const r = new FileReader();
    r.onload = () => setProfile((p) => ({ ...p, pdfDataUrl: r.result, pdfName: file.name }));
    r.readAsDataURL(file);
  };

  // ===== Fondo
  const overlayCss =
    profile.bgMode === "image"
      ? `linear-gradient(${profile.bgAngle}deg, rgba(0,0,0,${profile.overlayOpacity}) 0%, rgba(0,0,0,${profile.overlayOpacity}) 100%)`
      : null;

  const bgCss =
    profile.bgMode === "gradient"
      ? `linear-gradient(${profile.bgAngle}deg, ${profile.bgColor} 0%, ${profile.bgColor2} 100%)`
      : profile.bgMode === "solid"
      ? profile.bgColor
      : "#000";

  // ===== Colores botón
  const btnColorsFor = (key) => {
    const brand = PLATFORMS.find((p) => p.key === key)?.brand || profile.btnBg;
    const bg = profile.btnUseBrand ? brand : profile.btnBg;
    const border = profile.btnUseBrand ? brand : profile.btnBorder;
    const text = profile.btnText;
    return { bg, border, text };
  };

  // ===== vCard
  const downloadVCard = () => {
    const vcf = buildVCard(profile, visibleLinks, PLATFORMS);
    const nice = (profile.contactFullName || profile.title || "contacto").replace(/\s+/g, "_");
    downloadTextFile(`${nice}.vcf`, vcf, "text/vcard;charset=utf-8");
  };

  // ===== backend
  const loadFromBackend = async () => {
    try {
      setLoadingNet(true);
      const data = await API.getMeProfile();
      const mapped = fromServerDoc(data);
      setProfile(mapped.profile);
      setItems(mapped.items);
      setCtxProfile(data);
    } catch (e) {
      alert("❌ Error cargando: " + (e.message || "Desconocido"));
    } finally {
      setLoadingNet(false);
    }
  };

  const saveToBackend = async () => {
    try {
      setLoadingNet(true);
      const payload = toServerPayload(items, profile);
      const saved = await API.upsertMeProfile(payload);
      const mapped = fromServerDoc(saved);
      setProfile(mapped.profile);
      setItems(mapped.items);
      setCtxProfile(saved);
      alert("✅ Guardado");
    } catch (e) {
      alert("❌ Error guardando: " + (e.message || "Desconocido"));
    } finally {
      setLoadingNet(false);
    }
  };

  // ===== presets
  const applyPreset = (key) => {
    const p = STYLE_PRESETS.find((x) => x.key === key);
    if (!p) return;
    setProfile((prev) => ({ ...prev, ...p.patch }));
  };
  const surprise = () => {
    const all = STYLE_PRESETS;
    const r = all[Math.floor(Math.random() * all.length)];
    applyPreset(r.key);
  };

  // ===== header
  const headerTitle = user ? `Configura tu perfil (${user.username || user.email})` : "Configura tu perfil";

  // ===== font family css
  const cssFontFamily =
    profile.fontFamily === "System"
      ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      : `"${profile.fontFamily}", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;

  const titleText = profile.title?.trim() || "Tu nombre o marca";
  const descText = profile.description?.trim() || "Escribe una breve descripción…";

  return {
    // data/model
    PLATFORMS,
    PLACEHOLDERS,
    STYLE_PRESETS,
    FONTS,
    Grid,

    // state
    items,
    setItems,
    profile,
    setProfile,
    errors,
    openStep,
    setOpenStep,
    loadingNet,

    // computed
    visibleLinks,
    overlayCss,
    bgCss,
    cssFontFamily,
    headerTitle,
    titleText,
    descText,

    // actions
    toggleOpen,
    setUrl,
    setVisible,
    validateOne,
    onAvatarFile,
    onBgImageFile,
    onPdfFile,
    btnColorsFor,
    downloadVCard,
    loadFromBackend,
    saveToBackend,
    applyPreset,
    surprise,
    byKey,
  };
}