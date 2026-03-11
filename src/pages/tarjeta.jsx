import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Rnd } from "react-rnd";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Link2,
  MapPin,
  QrCode,
  Wifi,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Building2,
  Briefcase,
  Camera,
  Image as ImageIcon,
  CreditCard,
  BadgeCheck,
  Shield,
  Star,
  Heart,
  MessageCircle,
  Send,
  Calendar,
  Clock,
  Music,
  ShoppingBag,
  Car,
  Home,
  Smartphone,
} from "lucide-react";

/* ---------------- Helpers de unidades ---------------- */
const CSS_DPI = 96;
const mmToPx = (mm, dpi = CSS_DPI) => (mm / 25.4) * dpi;
const pxToMm = (px, dpi = CSS_DPI) => (px / dpi) * 25.4;

/* ---------------- Medidas fijas ---------------- */
const CARD_FIXED_MM = { w: 85.4, h: 54 };
const CARD_CORNER_MM = 3.175;

const CARD_FIXED = {
  widthPx: Math.round(mmToPx(CARD_FIXED_MM.w)),
  heightPx: Math.round(mmToPx(CARD_FIXED_MM.h)),
  radiusPx: Math.round(mmToPx(CARD_CORNER_MM)),
};

/* ---------------- Estilos Globales ---------------- */
const GlobalStyle = createGlobalStyle`
  :root{
    --bg: #f8fafc;
    --panel: #ffffff;
    --border: #e5e7eb;
    --text: #0f172a;
    --muted: #475569;
    --accent: #111827;
    --pill: #f3f4f6;
    --ring: #38bdf8;
    --shadow: 0 6px 22px rgba(0,0,0,.06);
    --shadow-hover: 0 2px 10px rgba(0,0,0,.08);
  }

  html, body, #root { height: 100%; }
  body{
    margin:0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input, select, button, textarea{
    font: inherit;
    color: inherit;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: #fff;
    padding: 8px 10px;
    outline: none;
  }
  input[type="color"]{ padding: 0; height: 36px; width: 52px; }
  input[type="range"]{ padding: 0; background: transparent; }
  input:focus, select:focus, textarea:focus{
    border-color: var(--ring);
    box-shadow: 0 0 0 3px rgba(56,189,248,.25);
  }
  button{ cursor: pointer; }
`;

/* ---------------- UI ---------------- */
const Wrap = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px;
`;

const TopBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const CenterStage = styled.div`
  display: flex;
  justify-content: center;
`;

const StageScroll = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0;
`;

const StageZoom = styled.div`
  transform: ${(p) => `scale(${p.$scale})`};
  transform-origin: top center;
`;

const CanvasCard = styled.div`
  width: ${(p) => p.$w}px;
  height: ${(p) => p.$h}px;
  position: relative;
  border-radius: ${(p) => p.$r}px;
  overflow: hidden;
  outline: 1px solid var(--border);
  box-shadow: 0 12px 32px rgba(0,0,0,.18);
`;

const Below = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 14px;
`;

const TwoCols = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;
  align-items: start;

  @media (max-width: 980px){
    grid-template-columns: 1fr;
  }
`;

const Btn = styled.button`
  padding:8px 12px;
  border-radius:12px;
  border:1px solid var(--border);
  background: var(--panel);
  transition: box-shadow .15s ease, transform .02s ease;
  &:hover{ box-shadow: var(--shadow-hover); }
  &:active{ transform: translateY(1px); }
`;

const StepBtn = styled.button`
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  font-weight: 700;
  line-height: 1;
`;

const Pill = styled.span`
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 10px; background:var(--pill);
  border:1px solid var(--border); border-radius:999px; font-size:12px;
`;

const Group = styled.div`
  border:1px solid var(--border);
  border-radius:14px;
  background:var(--panel);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const GroupHeader = styled.header`
  padding:12px 14px;
  border-bottom:1px solid #eef2f7;
  font-weight:600;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  flex-wrap: wrap;
`;

const GroupBody = styled.div`
  padding:12px;
  display:grid;
  gap:10px;
`;

const CollapseHint = styled.span`
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
`;

const LabelRow = styled.label`
  display:grid;
  grid-template-columns: 140px 1fr 160px;
  gap:10px;
  align-items:center;
  font-size:14px;

  @media (max-width: 520px){
    grid-template-columns: 1fr;
  }
`;

const Val = styled.span`
  justify-self:end; min-width:120px; text-align:center; font-variant-numeric:tabular-nums;
  background:#f1f5f9; border:1px solid var(--border); padding:8px 10px; border-radius:12px; color:var(--text);
  font-weight:700;

  @media (max-width: 520px){
    justify-self: start;
    min-width: 0;
    width: fit-content;
  }
`;

/* ✅ Toolbar flotante (dentro de la tarjeta) */
const FloatTools = styled.div`
  position: absolute;
  z-index: 99999;
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.92);
  border: 1px solid var(--border);
  box-shadow: 0 10px 24px rgba(0,0,0,.22);
  backdrop-filter: blur(6px);
  user-select: none;
  touch-action: none;
`;

const FloatBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  font-weight: 900;
  line-height: 1;
  display: grid;
  place-items: center;
`;

/* ---------------- Preview 360 ---------------- */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

const PreviewPanel = styled.div`
  width: min(920px, calc(100vw - 24px));
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 30px 90px rgba(0,0,0,.35);
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
`;

const PreviewBody = styled.div`
  padding: 14px;
  display: grid;
  place-items: center;
  gap: 10px;
`;

/* ---------------- Toast ---------------- */
const ToastHost = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10000;
  display: grid;
  gap: 10px;
`;

const ToastCard = styled.div`
  min-width: 260px;
  max-width: 360px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0,0,0,.18);
  overflow: hidden;
`;

const ToastTop = styled.div`
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const ToastMsg = styled.div`
  padding: 0 12px 12px;
  color: var(--muted);
  font-size: 13px;
`;

const ToastBadge = styled.span`
  font-size: 12px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--pill);
`;

/* ---------------- Confirm ---------------- */
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
`;

const ConfirmBox = styled.div`
  width: min(460px, calc(100vw - 24px));
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 30px 90px rgba(0,0,0,.35);
  overflow: hidden;
`;

const ConfirmHead = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
  font-weight: 900;
`;

const ConfirmBody = styled.div`
  padding: 12px 14px;
  color: var(--muted);
  font-size: 14px;
`;

const ConfirmActions = styled.div`
  padding: 12px 14px;
  border-top: 1px solid #eef2f7;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const DangerBtn = styled(Btn)`
  color: #dc2626;
  border-color: rgba(220,38,38,.25);
`;

/* ---------------- Cropper Modal ---------------- */
const CropOverlay = styled(Overlay)`
  z-index: 12000;
`;

const CropPanel = styled(PreviewPanel)`
  width: min(720px, calc(100vw - 24px));
`;

const CropBody = styled(PreviewBody)`
  padding: 14px;
`;

const CropStage = styled.div`
  width: min(560px, calc(100vw - 48px));
  height: min(420px, calc(100vh - 260px));
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #0b1220;
  position: relative;
  overflow: hidden;
  touch-action: none;
`;

const CropImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

const CropRect = styled.div`
  position: absolute;
  border: 2px solid rgba(56,189,248,.95);
  box-shadow: 0 0 0 9999px rgba(0,0,0,.45);
  border-radius: 10px;
`;

const CropHandle = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fff;
  border: 2px solid rgba(56,189,248,.95);
  box-shadow: 0 6px 16px rgba(0,0,0,.25);
`;

/* --------------- Tipografías --------------- */
const FONTS = [
  { label: "System", google: false, familyQuery: "" },
  { label: "Inter", google: true, familyQuery: "Inter:wght@300;400;500;600;700" },
  { label: "Poppins", google: true, familyQuery: "Poppins:wght@300;400;500;600;700" },
  { label: "Montserrat", google: true, familyQuery: "Montserrat:wght@300;400;500;600;700" },
  { label: "Raleway", google: true, familyQuery: "Raleway:wght@300;400;500;600;700" },
];

const getCssFamily = (label) => {
  if (label === "System") return "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  return `"${label}", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
};

const measureTextBox = ({
  text = "",
  fontFamily = "System",
  fontSize = 18,
  weight = 500,
  padding = 6,
  lineHeight = 1.2,
}) => {
  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.left = "-99999px";
  span.style.top = "-99999px";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "pre";
  span.style.display = "inline-block";
  span.style.fontFamily = getCssFamily(fontFamily);
  span.style.fontSize = `${fontSize}px`;
  span.style.fontWeight = String(weight);
  span.style.lineHeight = String(lineHeight);
  span.style.padding = `${padding}px`;
  span.textContent = text || "";
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  span.remove();
  return { w: Math.ceil(rect.width), h: Math.ceil(rect.height) };
};

/* --------------- Iconos (Lucide) --------------- */
const ICONS = {
  User,
  Phone,
  Mail,
  Link2,
  MapPin,
  QrCode,
  Wifi,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Building2,
  Briefcase,
  Camera,
  ImageIcon,
  CreditCard,
  BadgeCheck,
  Shield,
  Star,
  Heart,
  MessageCircle,
  Send,
  Calendar,
  Clock,
  Music,
  ShoppingBag,
  Car,
  Home,
  Smartphone,
};

/* ---------------- Estado por defecto ---------------- */
const STORAGE_KEY = "nfc_designer_dual_v2";

const defaultCard = () => ({
  width: CARD_FIXED.widthPx,
  height: CARD_FIXED.heightPx,
  radius: CARD_FIXED.radiusPx,
  bgColor: "#111827",
  bgImageDataUrl: "",
  showGrid: true,
  exportDPI: 300,
  safeMm: 7,
  nfcLink: "",
});

const enforceFixedCard = (c) => ({
  ...c,
  width: CARD_FIXED.widthPx,
  height: CARD_FIXED.heightPx,
  radius: CARD_FIXED.radiusPx,
});

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });

/* ---------------- Cropper (simple, sin libs) ---------------- */
function CropperModal({ open, src, aspect = 1, outMax = 1200, onCancel, onDone }) {
  const stageRef = useRef(null);
  const imgRef = useRef(null);

  // crop rect en coordenadas del stage (px)
  const [rect, setRect] = useState({ x: 80, y: 60, w: 280, h: 200 });

  const dragRef = useRef({
    mode: null, // "move" | "br" | "bl" | "tr" | "tl"
    startX: 0,
    startY: 0,
    startRect: null,
  });

  useEffect(() => {
    if (!open) return;
    // rect inicial centrado con el aspect
    requestAnimationFrame(() => {
      const st = stageRef.current;
      if (!st) return;
      const sw = st.clientWidth;
      const sh = st.clientHeight;

      let w = Math.min(sw * 0.7, sh * 0.7 * aspect);
      let h = w / aspect;

      if (h > sh * 0.75) {
        h = sh * 0.75;
        w = h * aspect;
      }

      setRect({
        x: Math.round((sw - w) / 2),
        y: Math.round((sh - h) / 2),
        w: Math.round(w),
        h: Math.round(h),
      });
    });
  }, [open, aspect]);

  const pointerDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current.mode = mode;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startRect = rect;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const pointerMove = (e) => {
    if (!dragRef.current.mode) return;
    const st = stageRef.current;
    if (!st) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const sr = dragRef.current.startRect;

    const sw = st.clientWidth;
    const sh = st.clientHeight;
    const minSize = 60;

    if (dragRef.current.mode === "move") {
      const nx = clamp(sr.x + dx, 0, sw - sr.w);
      const ny = clamp(sr.y + dy, 0, sh - sr.h);
      setRect({ ...sr, x: nx, y: ny });
      return;
    }

    // resize con aspect fijo
    const signX = dragRef.current.mode.includes("r") ? 1 : -1;
    const signY = dragRef.current.mode.includes("b") ? 1 : -1;

    // usamos dx o dy según dominante
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    let nw = sr.w + signX * delta;
    nw = clamp(nw, minSize, sw);
    let nh = Math.round(nw / aspect);
    if (nh < minSize) {
      nh = minSize;
      nw = Math.round(nh * aspect);
    }

    let nx = sr.x;
    let ny = sr.y;

    if (dragRef.current.mode.includes("l")) nx = sr.x + (sr.w - nw);
    if (dragRef.current.mode.includes("t")) ny = sr.y + (sr.h - nh);

    nx = clamp(nx, 0, sw - nw);
    ny = clamp(ny, 0, sh - nh);

    setRect({ x: nx, y: ny, w: nw, h: nh });
  };

  const pointerUp = () => {
    dragRef.current.mode = null;
  };

  const buildCropped = async () => {
    const st = stageRef.current;
    const img = imgRef.current;
    if (!st || !img) return;

    // cómo se dibuja el img con object-fit:contain dentro del stage:
    const sw = st.clientWidth;
    const sh = st.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // contain scale
    const scale = Math.min(sw / iw, sh / ih);
    const drawnW = iw * scale;
    const drawnH = ih * scale;
    const offsetX = (sw - drawnW) / 2;
    const offsetY = (sh - drawnH) / 2;

    // rect -> coordenadas dentro del "drawn image"
    const rx = rect.x - offsetX;
    const ry = rect.y - offsetY;

    const cropX = clamp(rx / scale, 0, iw);
    const cropY = clamp(ry / scale, 0, ih);
    const cropW = clamp(rect.w / scale, 1, iw - cropX);
    const cropH = clamp(rect.h / scale, 1, ih - cropY);

    // salida: limitar a outMax
    const outW = Math.min(outMax, Math.round(cropW));
    const outH = Math.round(outW / aspect);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");

    // draw + compresión JPEG
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88); // ✅ comprime fuerte para evitar caídas

    onDone?.(dataUrl);
  };

  if (!open) return null;

  return (
    <CropOverlay onClick={onCancel}>
      <CropPanel onClick={(e) => e.stopPropagation()}>
        <PreviewHeader>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <b>Cuadrar imagen</b>
            <Pill>Arrastra / redimensiona</Pill>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Btn onClick={onCancel}>Cancelar</Btn>
            <Btn onClick={buildCropped}>Guardar</Btn>
          </div>
        </PreviewHeader>

        <CropBody>
          <CropStage ref={stageRef} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
            <CropImg ref={imgRef} src={src} alt="crop" />

            <CropRect
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              onPointerDown={(e) => pointerDown(e, "move")}
            >
              {/* handles */}
              <CropHandle
                style={{ left: -11, top: -11 }}
                onPointerDown={(e) => pointerDown(e, "tl")}
              />
              <CropHandle
                style={{ right: -11, top: -11 }}
                onPointerDown={(e) => pointerDown(e, "tr")}
              />
              <CropHandle
                style={{ left: -11, bottom: -11 }}
                onPointerDown={(e) => pointerDown(e, "bl")}
              />
              <CropHandle
                style={{ right: -11, bottom: -11 }}
                onPointerDown={(e) => pointerDown(e, "br")}
              />
            </CropRect>
          </CropStage>

          <div style={{ color: "#64748b", fontSize: 13, textAlign: "center" }}>
            Tip: Si la foto es muy grande, acá la recortan y se guarda optimizada (evita que la app se caiga).
          </div>
        </CropBody>
      </CropPanel>
    </CropOverlay>
  );
}

const LinkeoTopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 20;
  @media(max-width:600px){ padding:12px 14px; flex-wrap:wrap; gap:8px; }
`;

const LogoDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #111827;
`;

const LinkeoBackBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82em;
  font-weight: 600;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 7px 14px;
  border-radius: 999px;
  transition: all 0.15s;
  &:hover { background: #f3f4f6; color: #111827; }
`;

const LinkeoBadge = styled.div`
  font-size: 0.75em;
  font-weight: 600;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
  &::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #10b981;
  }
`;

export default function Menu() {
  const navigate = useNavigate();
  const [side, setSide] = useState("front");
  const [cards, setCards] = useState({ front: defaultCard(), back: defaultCard() });
  const [elementsBySide, setElementsBySide] = useState({ front: [], back: [] });

  const elements = elementsBySide[side];
  const setElementsCurrent = (updater) =>
    setElementsBySide((prev) => ({
      ...prev,
      [side]: typeof updater === "function" ? updater(prev[side]) : updater,
    }));

  const card = cards[side];
  const setCard = (updater) =>
    setCards((prev) => ({
      ...prev,
      [side]: enforceFixedCard(typeof updater === "function" ? updater(prev[side]) : updater),
    }));

  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const imgInputRef = useRef(null);
  const bgImgInputRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  /* ✅ MODO CELULAR + ZOOM */
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false
  );
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) setCanvasScale(1.35);
    else setCanvasScale(1);
  }, [isMobile]);

  /* ✅ En móvil: colapsar panels */
  const [mobilePanels, setMobilePanels] = useState({ card: true, edit: true });

  const selectAndFocus = useCallback(
    (id) => {
      setSelectedId(id);
      if (isMobile) {
        // ✅ colapsa Tarjeta y deja edición visible (sin “bajar” nada raro)
        setMobilePanels({ card: false, edit: true });
      }
    },
    [isMobile]
  );

  const selected = useMemo(() => elements.find((e) => e.id === selectedId) || null, [elements, selectedId]);

  /* -------- Toast + Confirm -------- */
  const [toast, setToast] = useState(null);
  const [confirmUI, setConfirmUI] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    danger: false,
    onConfirm: null,
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (type, title, message) => setToast({ type, title, message });

  const openConfirm = ({ title, message, confirmText, cancelText, danger, onConfirm }) => {
    setConfirmUI({
      open: true,
      title,
      message,
      confirmText: confirmText || "Aceptar",
      cancelText: cancelText || "Cancelar",
      danger: !!danger,
      onConfirm: onConfirm || null,
    });
  };

  const closeConfirm = () => setConfirmUI((c) => ({ ...c, open: false }));

  /* ✅ Cropper UI state */
  const [cropUI, setCropUI] = useState({
    open: false,
    src: "",
    aspect: 1,
    outMax: 1200,
    onDone: null,
  });

  const openCropper = useCallback(async ({ file, aspect, outMax = 1200, onDone }) => {
    const src = await fileToDataUrl(file);
    setCropUI({ open: true, src, aspect, outMax, onDone });
  }, []);

  /* ------------ persistencia local (con try/catch para evitar crash) ------------ */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data?.cards && data?.elementsBySide) {
        setCards({
          front: enforceFixedCard({ ...defaultCard(), ...(data.cards.front || {}) }),
          back: enforceFixedCard({ ...defaultCard(), ...(data.cards.back || {}) }),
        });
        setElementsBySide({
          front: Array.isArray(data.elementsBySide.front) ? data.elementsBySide.front : [],
          back: Array.isArray(data.elementsBySide.back) ? data.elementsBySide.back : [],
        });
      }
    } catch (e) {
      console.log("No se pudo cargar layout guardado", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cards, elementsBySide }));
    } catch (e) {
      // ✅ evita que “se caiga” si se excede cuota
      console.warn("localStorage quota exceeded", e);
      notify("error", "Guardado local", "Las imágenes son muy pesadas. Usa el recorte (se guarda optimizado).");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, elementsBySide]);

  /* --------------- Google Fonts loader --------------- */
  const usedGoogleFamilies = useMemo(() => {
    const fams = new Set(
      elementsBySide.front
        .concat(elementsBySide.back)
        .filter((e) => e.type === "text" && e.fontFamily && e.fontFamily !== "System")
        .map((e) => e.fontFamily)
    );

    const queries = [];
    fams.forEach((label) => {
      const f = FONTS.find((x) => x.label === label);
      if (f?.google && f.familyQuery) queries.push(f.familyQuery);
    });
    return queries;
  }, [elementsBySide]);

  useEffect(() => {
    const id = "nfc-google-fonts-link";
    const existing = document.getElementById(id);
    if (!usedGoogleFamilies.length) {
      if (existing) existing.remove();
      return;
    }
    const familyParams = usedGoogleFamilies.map((q) => `family=${q}`).join("&");
    const href = `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
    if (existing) existing.setAttribute("href", href);
    else {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    }
  }, [usedGoogleFamilies]);

  /* ------------- Acciones rápidas ------------- */
  const addTitle = () => {
    const base = {
      id: newId(),
      type: "text",
      text: "Título",
      x: 24,
      y: 24,
      color: "#ffffff",
      align: "left",
      weight: 700,
      fontSize: 28,
      fontFamily: "Inter",
      rotate: 0,
      bg: "transparent",
      radius: 0,
      autoFit: true,
    };
    const { w, h } = measureTextBox(base);
    setElementsCurrent((els) => [...els, { ...base, w, h }]);
  };

  const addSubtitle = () => {
    const base = {
      id: newId(),
      type: "text",
      text: "Subtítulo",
      x: 24,
      y: 96,
      color: "#e5e7eb",
      align: "left",
      weight: 500,
      fontSize: 18,
      fontFamily: "Inter",
      rotate: 0,
      bg: "transparent",
      radius: 0,
      autoFit: true,
    };
    const { w, h } = measureTextBox(base);
    setElementsCurrent((els) => [...els, { ...base, w, h }]);
  };

  /* ✅ Imagen con Cropper + Compresión */
  const onPickImage = useCallback(
    async (file) => {
      const aspect = 200 / 120; // default del elemento
      await openCropper({
        file,
        aspect,
        outMax: 1200,
        onDone: (croppedDataUrl) => {
          setElementsCurrent((els) => [
            ...els,
            {
              id: newId(),
              type: "image",
              src: croppedDataUrl,
              objectFit: "cover",
              x: 24,
              y: 170,
              w: 200,
              h: 120,
              rotate: 0,
              radius: 12,
              bg: "transparent",
            },
          ]);
        },
      });
    },
    [openCropper, setElementsCurrent]
  );

  const addIcon = () => {
    setElementsCurrent((els) => [
      ...els,
      {
        id: newId(),
        type: "icon",
        iconName: "User",
        x: card.width - 90,
        y: 20,
        w: 64,
        h: 64,
        color: "#ffffff",
        rotate: 0,
        bg: "transparent",
        radius: 0,
      },
    ]);
  };

  /* ------------- Acciones: selección ------------- */
  const updateSelected = (patch) => {
    if (!selectedId) return;

    setElementsCurrent((els) =>
      els.map((e) => {
        if (e.id !== selectedId) return e;

        const next = { ...e, ...patch };

        const affectsText =
          e.type === "text" &&
          (patch.text !== undefined ||
            patch.fontFamily !== undefined ||
            patch.fontSize !== undefined ||
            patch.weight !== undefined);

        if (affectsText && next.autoFit !== false) {
          const { w, h } = measureTextBox(next);
          next.w = w;
          next.h = h;
        }

        return next;
      })
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElementsCurrent((els) => els.filter((e) => e.id !== selectedId));
    setSelectedId(null);
    if (isMobile) setMobilePanels((p) => ({ ...p, card: true }));
  };

  const duplicateSelected = () => {
    if (!selectedId) return;
    setElementsCurrent((els) => {
      const idx = els.findIndex((e) => e.id === selectedId);
      if (idx === -1) return els;
      const c = JSON.parse(JSON.stringify(els[idx]));
      c.id = newId();
      c.x += 12;
      c.y += 12;
      return [...els.slice(0, idx + 1), c, ...els.slice(idx + 1)];
    });
  };

  const moveZ = (dir) => {
    if (!selectedId) return;
    setElementsCurrent((els) => {
      const i = els.findIndex((e) => e.id === selectedId);
      if (i === -1) return els;
      const copy = [...els];
      if (dir === "front" && i < copy.length - 1) [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
      if (dir === "back" && i > 0) [copy[i], copy[i - 1]] = [copy[i - 1], copy[i]];
      return copy;
    });
  };

  /* ✅ Resizing cómodo en celular */
  const mobileEnableResizing = useMemo(
    () => ({
      top: false,
      right: false,
      bottom: false,
      left: false,
      topRight: true,
      bottomRight: true,
      bottomLeft: true,
      topLeft: true,
    }),
    []
  );

  const mobileHandleStyles = useMemo(() => {
    const base = {
      width: 22,
      height: 22,
      borderRadius: 999,
      background: "#fff",
      border: "2px solid rgba(56,189,248,.95)",
      boxShadow: "0 6px 16px rgba(0,0,0,.18)",
    };
    return { topRight: base, bottomRight: base, bottomLeft: base, topLeft: base };
  }, []);

  /* ✅ Ajustar tamaño desde la tarjeta */
  const scaleSelectedBox = (factor) => {
    if (!selectedId) return;

    setElementsCurrent((els) =>
      els.map((e) => {
        if (e.id !== selectedId) return e;
        if (e.type !== "image" && e.type !== "icon") return e;

        const minSize = 20;
        const maxW = card.width;
        const maxH = card.height;

        const newW = clamp(Math.round(e.w * factor), minSize, maxW);
        const newH = clamp(Math.round(e.h * factor), minSize, maxH);

        const cx = e.x + e.w / 2;
        const cy = e.y + e.h / 2;

        let nx = Math.round(cx - newW / 2);
        let ny = Math.round(cy - newH / 2);

        nx = clamp(nx, 0, maxW - newW);
        ny = clamp(ny, 0, maxH - newH);

        return { ...e, w: newW, h: newH, x: nx, y: ny };
      })
    );
  };

  const bumpSelectedFont = (delta) => {
    if (!selectedId) return;
    if (!selected || selected.type !== "text") return;
    updateSelected({ fontSize: Math.max(6, (selected.fontSize || 18) + delta) });
  };

  const safePx = useMemo(() => mmToPx(card.safeMm || 0), [card.safeMm]);

  const setSafeMm = (val) => {
    const n = Number(val);
    const safe = Number.isFinite(n) ? Math.max(0, Math.min(20, n)) : 0;
    setCard((c) => ({ ...c, safeMm: safe }));
  };

  /* ✅ Posición toolbar */
  const floatPos = useMemo(() => {
    if (!selected || exporting) return null;

    const count =
      selected.type === "text" ? 2 : selected.type === "image" ? 4 : selected.type === "icon" ? 2 : 0;

    if (count === 0) return null;

    const BTN = 36;
    const GAP = 6;
    const PAD = 6;
    const toolW = PAD * 2 + count * BTN + (count - 1) * GAP;
    const toolH = PAD * 2 + BTN;

    let left = selected.x + selected.w / 2 - toolW / 2;
    let top = selected.y - toolH - 10;

    if (top < 6) top = selected.y + selected.h + 10;

    left = clamp(left, 6, card.width - toolW - 6);
    top = clamp(top, 6, card.height - toolH - 6);

    return { left, top };
  }, [selected, exporting, card.width, card.height]);

  /* ---------------- Filtro exportación ---------------- */
  const exportFilter = useCallback((n) => {
    const el = n;
    if (el?.dataset?.noprint === "true") return false;
    const cls = typeof el?.className === "string" ? el.className : "";
    if (cls.includes("react-resizable-handle")) return false;
    return true;
  }, []);

  /* ---------------- Preview 360 (PNG limpio) ---------------- */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewImgs, setPreviewImgs] = useState({ front: "", back: "" });

  const [spin, setSpin] = useState({ rx: 0, ry: 0 });
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  // throttle rAF
  const rafRef = useRef(0);
  const pendingRef = useRef({ dx: 0, dy: 0 });

  const onPreviewPointerDown = (e) => {
    draggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPreviewPointerMove = (e) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };

    pendingRef.current.dx += dx;
    pendingRef.current.dy += dy;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const { dx: pdx, dy: pdy } = pendingRef.current;
      pendingRef.current = { dx: 0, dy: 0 };

      setSpin((s) => ({
        ry: s.ry + pdx * 0.6,
        rx: clamp(s.rx - pdy * 0.35, -35, 35),
      }));
    });
  };

  const onPreviewPointerUp = () => {
    draggingRef.current = false;
  };

  const captureSideForPreview = useCallback(
    async (whichSide) => {
      const prevSide = side;
      const prevSelected = selectedId;

      setExporting(true);
      setSelectedId(null); // ✅ sin selección
      if (whichSide !== side) setSide(whichSide);

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const node = stageRef.current;
      if (!node) {
        setExporting(false);
        if (whichSide !== prevSide) setSide(prevSide);
        setSelectedId(prevSelected);
        return "";
      }

      try {
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const ratio = isMobile ? Math.min(2.2, dpr * 1.35) : Math.min(2, dpr * 1.1);

        return await toPng(node, { pixelRatio: ratio, cacheBust: true, filter: exportFilter });
      } catch (e) {
        console.error(e);
        return "";
      } finally {
        setExporting(false);
        if (whichSide !== prevSide) setSide(prevSide);
        setSelectedId(prevSelected);
      }
    },
    [side, selectedId, isMobile, exportFilter]
  );

  const openPreview = useCallback(async () => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setSpin({ rx: 0, ry: 0 });

    const front = await captureSideForPreview("front");
    const back = await captureSideForPreview("back");

    setPreviewImgs({ front, back });
    setPreviewLoading(false);
  }, [captureSideForPreview]);

  /* ------------- Exportar PNG/PDF ------------- */
  const exportSideToPng = useCallback(
    async (whichSide) => {
      setExporting(true);
      const prevSide = side;
      const prevSelected = selectedId;

      setSelectedId(null);
      if (whichSide !== side) setSide(whichSide);

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const node = stageRef.current;
      if (!node) {
        setExporting(false);
        if (whichSide !== prevSide) setSide(prevSide);
        setSelectedId(prevSelected);
        notify("error", "Exportación", "No se encontró el canvas para exportar.");
        return null;
      }

      try {
        const ratio = (cards[whichSide].exportDPI || 300) / CSS_DPI;
        const dataUrl = await toPng(node, { pixelRatio: ratio, cacheBust: true, filter: exportFilter });
        notify("success", "Exportación", `PNG generado (${whichSide})`);
        return dataUrl;
      } catch (e) {
        console.error(e);
        notify("error", "Exportación", "No se pudo exportar PNG.");
        return null;
      } finally {
        setExporting(false);
        if (whichSide !== prevSide) setSide(prevSide);
        setSelectedId(prevSelected);
      }
    },
    [side, selectedId, cards, exportFilter]
  );

  const doExport = useCallback(
    async (whichSide = side) => {
      const dataUrl = await exportSideToPng(whichSide);
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `tarjeta_nfc_${whichSide}_${cards[whichSide].exportDPI || 300}dpi.png`;
      a.click();
    },
    [exportSideToPng, side, cards]
  );

  const exportPDFBoth = useCallback(async () => {
    const frontPng = await exportSideToPng("front");
    const backPng = await exportSideToPng("back");
    if (!frontPng || !backPng) return;

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const gap = 8;

    const fWmm = pxToMm(cards.front.width);
    const fHmm = pxToMm(cards.front.height);
    const bWmm = pxToMm(cards.back.width);
    const bHmm = pxToMm(cards.back.height);

    const scaleW = (pageW - 2 * margin) / Math.max(fWmm, bWmm);
    const scaleH = (pageH - 2 * margin - gap) / (fHmm + bHmm);
    const scale = Math.min(scaleW, scaleH, 1);

    const drawFW = fWmm * scale;
    const drawFH = fHmm * scale;
    const drawBW = bWmm * scale;
    const drawBH = bHmm * scale;

    const drawWMax = Math.max(drawFW, drawBW);
    const x = margin + ((pageW - 2 * margin) - drawWMax) / 2;

    const yFront = margin;
    const yBack = margin + drawFH + gap;

    pdf.addImage(frontPng, "PNG", x + (drawWMax - drawFW) / 2, yFront, drawFW, drawFH);
    pdf.addImage(backPng, "PNG", x + (drawWMax - drawBW) / 2, yBack, drawBW, drawBH);

    const frontLink = (cards.front.nfcLink || "").trim();
    let yText = yBack + drawBH + 10;

    if (yText > pageH - margin - 20) {
      pdf.addPage();
      yText = margin;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Link NFC (Anverso):", margin, yText);
    yText += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const maxTextW = pageW - 2 * margin;
    const line = frontLink || "—";
    const lines = pdf.splitTextToSize(line, maxTextW);
    pdf.text(lines, margin, yText);

    if (frontLink) {
      const yStart = yText - 4;
      const h = lines.length * 5 + 2;
      try {
        pdf.link(margin, yStart, maxTextW, h, { url: frontLink });
      } catch (_) {}
    }

    pdf.save("tarjeta_nfc_anverso_reverso.pdf");
    notify("success", "Exportación", "PDF generado (anverso + reverso + link anverso).");
  }, [cards, exportSideToPng]);

  /* ------------- JSON export/import ------------- */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ cards, elementsBySide }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tarjeta_nfc_dual_layout.json";
    a.click();
    URL.revokeObjectURL(a.href);
    notify("success", "Exportación", "JSON exportado.");
  };

  const importJSON = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => notify("error", "Importación", "No se pudo leer el archivo.");
    reader.onload = () => {
      try {
        const text = typeof reader.result === "string" ? reader.result : new TextDecoder().decode(reader.result);
        const data = JSON.parse(text);

        if (data?.cards && data?.elementsBySide) {
          setCards({
            front: enforceFixedCard({ ...defaultCard(), ...(data.cards.front || {}) }),
            back: enforceFixedCard({ ...defaultCard(), ...(data.cards.back || {}) }),
          });
          setElementsBySide({
            front: Array.isArray(data.elementsBySide.front) ? data.elementsBySide.front : [],
            back: Array.isArray(data.elementsBySide.back) ? data.elementsBySide.back : [],
          });
          notify("success", "Importación", "Layout importado.");
          return;
        }

        notify("error", "Importación", "El JSON no contiene datos reconocibles.");
      } catch (e) {
        console.error(e);
        notify("error", "Importación", "JSON inválido.");
      }
    };

    reader.readAsText(file, "utf-8");
  };

  const resetAll = () => {
    openConfirm({
      title: "Resetear diseño",
      message: "¿Resetear ambas caras y los elementos? Esto también borra el guardado local.",
      confirmText: "Sí, resetear",
      cancelText: "Cancelar",
      danger: true,
      onConfirm: () => {
        setCards({ front: defaultCard(), back: defaultCard() });
        setElementsBySide({ front: [], back: [] });
        setSelectedId(null);
        localStorage.removeItem(STORAGE_KEY);
        closeConfirm();
        notify("success", "Listo", "Se reseteó el diseño.");
      },
    });
  };

  const toastIcon = (t) => (t === "success" ? "✅" : t === "error" ? "❌" : "ℹ️");

  return (
    <>
      <GlobalStyle />
  {/* ── NUEVO HEADER LINKEO ── */}
    <LinkeoTopBar>
      <LinkeoBackBtn onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"/>
        </svg>
        Volver
      </LinkeoBackBtn>

      <div style={{ display:"flex", alignItems:"center", gap:8, fontWeight:800, fontSize:"1em" }}>
        <LogoDot />
        LINKEO
        <span style={{ fontWeight:400, color:"#6b7280", marginLeft:4 }}>Diseñar tarjeta</span>
      </div>

      <LinkeoBadge>Diseñador NFC</LinkeoBadge>
    </LinkeoTopBar>
      {/* ✅ Cropper modal */}
      <CropperModal
        open={cropUI.open}
        src={cropUI.src}
        aspect={cropUI.aspect}
        outMax={cropUI.outMax}
        onCancel={() => setCropUI((c) => ({ ...c, open: false }))}
        onDone={(dataUrl) => {
          const cb = cropUI.onDone;
          setCropUI((c) => ({ ...c, open: false }));
          cb?.(dataUrl);
        }}
      />

      <Wrap>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Diseñador de Tarjeta NFC</h2>

        <TopBar>
          <Pill>Vista</Pill>
          <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 999, overflow: "hidden" }}>
            {["front", "back"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSide(s);
                  setSelectedId(null);
                }}
                style={{
                  padding: "8px 12px",
                  border: 0,
                  cursor: "pointer",
                  background: side === s ? "var(--accent)" : "#fff",
                  color: side === s ? "#fff" : "var(--accent)",
                }}
              >
                {s === "front" ? "Anverso" : "Reverso"}
              </button>
            ))}
          </div>

          {isMobile && (
            <>
              <Pill>Zoom</Pill>
              <StepBtn type="button" onClick={() => setCanvasScale((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))} aria-label="Zoom -">
                −
              </StepBtn>
              <input
                type="range"
                min="0.8"
                max="2"
                step="0.05"
                value={canvasScale}
                onChange={(e) => setCanvasScale(Number(e.target.value))}
                style={{ width: 160 }}
              />
              <StepBtn type="button" onClick={() => setCanvasScale((z) => Math.min(2, +(z + 0.1).toFixed(2)))} aria-label="Zoom +">
                +
              </StepBtn>
              <Pill>{Math.round(canvasScale * 100)}%</Pill>
            </>
          )}

          <Btn onClick={() => doExport()}>⬇️ Exportar PNG ({side})</Btn>
          <Btn onClick={exportPDFBoth}>📄 Exportar PDF</Btn>
          <Btn onClick={openPreview}>👁️ Preview 360</Btn>

          <Btn onClick={exportJSON}>🧾 Exportar JSON</Btn>
          <label style={{ display: "inline-block" }}>
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
            <Btn onClick={(e) => e.currentTarget.previousSibling?.click?.()}>📥 Importar JSON</Btn>
          </label>

          <Btn onClick={resetAll} style={{ color: "#dc2626" }}>
            ♻️ Reset
          </Btn>
        </TopBar>

        <CenterStage>
          <StageScroll>
            <StageZoom $scale={canvasScale}>
              <CanvasCard
                ref={stageRef}
                $w={card.width}
                $h={card.height}
                $r={card.radius}
                style={{
                  background: card.bgImageDataUrl ? undefined : card.bgColor,
                  backgroundImage: card.bgImageDataUrl ? `url(${card.bgImageDataUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  touchAction: "none",
                }}
                onPointerDown={(e) => {
                  if (e.target === stageRef.current) {
                    setSelectedId(null);
                    if (isMobile) setMobilePanels((p) => ({ ...p, card: true }));
                  }
                }}
              >
                {/* ✅ Toolbar flotante */}
                {floatPos && (
                  <FloatTools
                    data-noprint="true"
                    style={{ left: floatPos.left, top: floatPos.top }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {selected?.type === "text" && (
                      <>
                        <FloatBtn title="Disminuir texto" onClick={() => bumpSelectedFont(-1)}>A−</FloatBtn>
                        <FloatBtn title="Aumentar texto" onClick={() => bumpSelectedFont(+1)}>A+</FloatBtn>
                      </>
                    )}

                    {(selected?.type === "image" || selected?.type === "icon") && (
                      <>
                        <FloatBtn title="Achicar" onClick={() => scaleSelectedBox(0.95)}>−</FloatBtn>
                        <FloatBtn title="Agrandar" onClick={() => scaleSelectedBox(1.05)}>+</FloatBtn>

                        {selected?.type === "image" && (
                          <>
                            <FloatBtn title="Cover" onClick={() => updateSelected({ objectFit: "cover" })} style={{ fontSize: 12, fontWeight: 900 }}>
                              CVR
                            </FloatBtn>
                            <FloatBtn title="Contain" onClick={() => updateSelected({ objectFit: "contain" })} style={{ fontSize: 12, fontWeight: 900 }}>
                              CNT
                            </FloatBtn>
                          </>
                        )}
                      </>
                    )}
                  </FloatTools>
                )}

                {/* Grilla */}
                {card.showGrid && !exporting && (
                  <div
                    data-noprint="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                      backgroundSize: "20px 20px, 20px 20px",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Trim */}
                {!exporting && (
                  <div
                    data-noprint="true"
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: card.radius,
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,.45)",
                      pointerEvents: "none",
                    }}
                    title="Línea de corte (trim)"
                  />
                )}

                {/* Safe zone */}
                {!exporting && card.safeMm > 0 && (
                  <div
                    data-noprint="true"
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: safePx,
                      top: safePx,
                      right: safePx,
                      bottom: safePx,
                      borderRadius: Math.max(0, card.radius - safePx),
                      boxShadow: "inset 0 0 0 1px rgba(16,185,129,.95)",
                      pointerEvents: "none",
                    }}
                    title="Zona segura"
                  />
                )}

                {elements.map((el, idx) => (
                  <Rnd
                    key={el.id}
                    bounds="parent"
                    scale={canvasScale}
                    size={{ width: el.w, height: el.h }}
                    position={{ x: el.x, y: el.y }}
                    enableResizing={selectedId === el.id ? (isMobile ? mobileEnableResizing : true) : false}
                    resizeHandleStyles={selectedId === el.id && isMobile ? mobileHandleStyles : undefined}
                    style={{
                      zIndex: idx + 1,
                      border: !exporting && selectedId === el.id ? "1px dashed #38bdf8" : "1px dashed transparent",
                      borderRadius: 8,
                      touchAction: "none",
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      selectAndFocus(el.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      selectAndFocus(el.id);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      selectAndFocus(el.id);
                    }}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      selectAndFocus(el.id);
                    }}
                    onResizeStart={(e) => {
                      e.stopPropagation();
                      selectAndFocus(el.id);
                    }}
                    onDragStop={(e, d) =>
                      setElementsCurrent((arr) => arr.map((x) => (x.id === el.id ? { ...x, x: d.x, y: d.y } : x)))
                    }
                    onResizeStop={(e, dir, ref, delta, pos) =>
                      setElementsCurrent((arr) =>
                        arr.map((x) =>
                          x.id === el.id ? { ...x, w: ref.offsetWidth, h: ref.offsetHeight, x: pos.x, y: pos.y } : x
                        )
                      )
                    }
                  >
                    {el.type === "text" ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: 6,
                          color: el.color,
                          background: el.bg,
                          borderRadius: el.radius,
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
                          transform: `rotate(${el.rotate || 0}deg)`,
                          fontSize: (el.fontSize || 18) + "px",
                          fontWeight: el.weight || 500,
                          userSelect: "none",
                          textAlign: el.align,
                          lineHeight: 1.2,
                          overflow: "hidden",
                          whiteSpace: "pre-wrap",
                          fontFamily: getCssFamily(el.fontFamily || "System"),
                          pointerEvents: "none",
                        }}
                      >
                        {el.text}
                      </div>
                    ) : el.type === "image" ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `rotate(${el.rotate || 0}deg)`,
                          borderRadius: el.radius || 0,
                          overflow: "hidden",
                          background: el.bg || "transparent",
                          pointerEvents: "none",
                        }}
                      >
                        <img
                          src={el.src}
                          alt=""
                          draggable={false}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: el.objectFit || "cover",
                            display: "block",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `rotate(${el.rotate || 0}deg)`,
                          color: el.color || "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: el.bg || "transparent",
                          borderRadius: el.radius || 0,
                          pointerEvents: "none",
                        }}
                      >
                        {(() => {
                          const Comp = ICONS[el.iconName || "User"] || ICONS.User;
                          return <Comp style={{ width: "100%", height: "100%" }} color={el.color || "#fff"} strokeWidth={2} />;
                        })()}
                      </div>
                    )}
                  </Rnd>
                ))}
              </CanvasCard>
            </StageZoom>
          </StageScroll>
        </CenterStage>

        <Below>
          <TwoCols>
            {/* Tarjeta */}
            <Group>
              <GroupHeader
                onClick={() => {
                  if (!isMobile) return;
                  setMobilePanels((p) => ({ ...p, card: !p.card }));
                }}
                style={{ cursor: isMobile ? "pointer" : "default" }}
              >
                <span>Tarjeta ({side === "front" ? "Anverso" : "Reverso"})</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Pill>8.54 × 5.4 cm</Pill>
                  {isMobile && <CollapseHint>{mobilePanels.card ? "▲" : "▼"}</CollapseHint>}
                </div>
              </GroupHeader>

              {(!isMobile || mobilePanels.card) && (
                <GroupBody>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Btn onClick={addTitle}>🅰️ Título</Btn>
                    <Btn onClick={addSubtitle}>🅱️ Subtítulo</Btn>
                    <Btn onClick={() => imgInputRef.current?.click()}>🖼️ Imagen</Btn>
                    <Btn onClick={addIcon}>🔣 Icono</Btn>
                  </div>

                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && onPickImage(e.target.files[0])}
                  />

                  <LabelRow>
                    Fondo
                    <input type="color" value={card.bgColor} onChange={(e) => setCard((c) => ({ ...c, bgColor: e.target.value }))} />
                    <Val>color</Val>
                  </LabelRow>

                  {side === "front" && (
                    <LabelRow>
                      Link NFC
                      <input
                        type="url"
                        placeholder="https://tusitio.com/..."
                        value={cards.front.nfcLink || ""}
                        onChange={(e) =>
                          setCards((prev) => ({
                            ...prev,
                            front: enforceFixedCard({ ...prev.front, nfcLink: e.target.value }),
                          }))
                        }
                      />
                      <Val>{(cards.front.nfcLink || "").slice(0, 18) || "—"}</Val>
                    </LabelRow>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={card.showGrid}
                        onChange={(e) => setCard((c) => ({ ...c, showGrid: e.target.checked }))}
                      />
                      Mostrar grilla
                    </label>

                    <input
                      ref={bgImgInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;

                        // ✅ cropper para fondo con aspect de tarjeta
                        const aspect = card.width / card.height;
                        await openCropper({
                          file: f,
                          aspect,
                          outMax: 1400,
                          onDone: (croppedDataUrl) => setCard((c) => ({ ...c, bgImageDataUrl: croppedDataUrl })),
                        });
                      }}
                    />

                    <Btn onClick={() => bgImgInputRef.current?.click?.()}>🖼️ Fondo imagen</Btn>
                    {card.bgImageDataUrl && <Btn onClick={() => setCard((c) => ({ ...c, bgImageDataUrl: "" }))}>Quitar imagen</Btn>}
                  </div>

                  <LabelRow>
                    Zona segura
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <StepBtn type="button" onClick={() => setSafeMm((card.safeMm || 0) - 1)} aria-label="Disminuir">
                        −
                      </StepBtn>

                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="1"
                        value={card.safeMm}
                        placeholder="Ej: 7"
                        onChange={(e) => setSafeMm(e.target.value)}
                        style={{
                          width: 120,
                          borderColor: "rgba(16,185,129,.7)",
                          boxShadow: "0 0 0 3px rgba(16,185,129,.15)",
                          fontWeight: 700,
                        }}
                      />

                      <StepBtn type="button" onClick={() => setSafeMm((card.safeMm || 0) + 1)} aria-label="Aumentar">
                        +
                      </StepBtn>
                    </div>
                    <Val>{card.safeMm} mm</Val>
                  </LabelRow>
                </GroupBody>
              )}
            </Group>

            {/* Elemento seleccionado */}
            <Group>
              <GroupHeader
                onClick={() => {
                  if (!isMobile) return;
                  setMobilePanels((p) => ({ ...p, edit: !p.edit }));
                }}
                style={{ cursor: isMobile ? "pointer" : "default" }}
              >
                <span>Elemento seleccionado</span>
                {isMobile && <CollapseHint>{mobilePanels.edit ? "▲" : "▼"}</CollapseHint>}
              </GroupHeader>

              {(!isMobile || mobilePanels.edit) && (
                <GroupBody>
                  {!selected ? (
                    <div style={{ color: "#6b7280" }}>Toca un elemento en la tarjeta para editarlo.</div>
                  ) : selected.type === "text" ? (
                    <>
                      <LabelRow>
                        Texto
                        <input type="text" value={selected.text} onChange={(e) => updateSelected({ text: e.target.value })} />
                        <Val>—</Val>
                      </LabelRow>

                      <LabelRow>
                        Fuente
                        <select value={selected.fontFamily || "System"} onChange={(e) => updateSelected({ fontFamily: e.target.value })}>
                          {FONTS.map((f) => (
                            <option key={f.label} value={f.label}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                        <Val>{selected.fontFamily || "System"}</Val>
                      </LabelRow>

                      <LabelRow>
                        Tamaño
                        <input type="number" value={selected.fontSize || 18} onChange={(e) => updateSelected({ fontSize: Number(e.target.value || 0) })} />
                        <Val>{selected.fontSize || 18}px</Val>
                      </LabelRow>

                      <LabelRow>
                        Peso
                        <input type="range" min="300" max="900" step="100" value={selected.weight || 500} onChange={(e) => updateSelected({ weight: Number(e.target.value) })} />
                        <Val>{selected.weight || 500}</Val>
                      </LabelRow>

                      <LabelRow>
                        Color
                        <input type="color" value={selected.color || "#ffffff"} onChange={(e) => updateSelected({ color: e.target.value })} />
                        <Val>texto</Val>
                      </LabelRow>

                      <LabelRow>
                        Alineación
                        <select value={selected.align || "left"} onChange={(e) => updateSelected({ align: e.target.value })}>
                          <option value="left">Izquierda</option>
                          <option value="center">Centro</option>
                          <option value="right">Derecha</option>
                        </select>
                        <Val>{selected.align || "left"}</Val>
                      </LabelRow>

                      <LabelRow>
                        Fondo
                        <input type="color" value={selected.bg || "transparent"} onChange={(e) => updateSelected({ bg: e.target.value })} />
                        <Val>fondo</Val>
                      </LabelRow>

                      <LabelRow>
                        Radio
                        <input type="range" min="0" max="40" value={selected.radius || 0} onChange={(e) => updateSelected({ radius: Number(e.target.value) })} />
                        <Val>{selected.radius || 0}px</Val>
                      </LabelRow>

                      <LabelRow>
                        Rotación
                        <input type="range" min="-180" max="180" value={selected.rotate || 0} onChange={(e) => updateSelected({ rotate: Number(e.target.value) })} />
                        <Val>{selected.rotate || 0}°</Val>
                      </LabelRow>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Btn onClick={() => moveZ("back")}>⬇️ Enviar atrás</Btn>
                        <Btn onClick={() => moveZ("front")}>⬆️ Traer al frente</Btn>
                        <Btn onClick={duplicateSelected}>🧬 Duplicar</Btn>
                        <Btn onClick={deleteSelected} style={{ color: "#dc2626" }}>
                          🗑️ Eliminar
                        </Btn>
                      </div>
                    </>
                  ) : selected.type === "image" ? (
                    <>
                      <LabelRow>
                        Ajuste
                        <select value={selected.objectFit || "cover"} onChange={(e) => updateSelected({ objectFit: e.target.value })}>
                          <option value="cover">Cover</option>
                          <option value="contain">Contain</option>
                          <option value="fill">Fill</option>
                        </select>
                        <Val>{selected.objectFit || "cover"}</Val>
                      </LabelRow>

                      <LabelRow>
                        Fondo
                        <input type="color" value={selected.bg || "transparent"} onChange={(e) => updateSelected({ bg: e.target.value })} />
                        <Val>fondo</Val>
                      </LabelRow>

                      <LabelRow>
                        Radio
                        <input type="range" min="0" max="60" value={selected.radius || 0} onChange={(e) => updateSelected({ radius: Number(e.target.value) })} />
                        <Val>{selected.radius || 0}px</Val>
                      </LabelRow>

                      <LabelRow>
                        Rotación
                        <input type="range" min="-180" max="180" value={selected.rotate || 0} onChange={(e) => updateSelected({ rotate: Number(e.target.value) })} />
                        <Val>{selected.rotate || 0}°</Val>
                      </LabelRow>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Btn onClick={() => moveZ("back")}>⬇️ Enviar atrás</Btn>
                        <Btn onClick={() => moveZ("front")}>⬆️ Traer al frente</Btn>
                        <Btn onClick={duplicateSelected}>🧬 Duplicar</Btn>
                        <Btn onClick={deleteSelected} style={{ color: "#dc2626" }}>
                          🗑️ Eliminar
                        </Btn>
                      </div>
                    </>
                  ) : (
                    <>
                      <LabelRow>
                        Icono
                        <select value={selected.iconName || "User"} onChange={(e) => updateSelected({ iconName: e.target.value })}>
                          {Object.keys(ICONS).map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                        <Val>{selected.iconName || "User"}</Val>
                      </LabelRow>

                      <LabelRow>
                        Color
                        <input type="color" value={selected.color || "#ffffff"} onChange={(e) => updateSelected({ color: e.target.value })} />
                        <Val>trazo</Val>
                      </LabelRow>

                      <LabelRow>
                        Fondo
                        <input type="color" value={selected.bg || "transparent"} onChange={(e) => updateSelected({ bg: e.target.value })} />
                        <Val>fondo</Val>
                      </LabelRow>

                      <LabelRow>
                        Radio
                        <input type="range" min="0" max="60" value={selected.radius || 0} onChange={(e) => updateSelected({ radius: Number(e.target.value) })} />
                        <Val>{selected.radius || 0}px</Val>
                      </LabelRow>

                      <LabelRow>
                        Rotación
                        <input type="range" min="-180" max="180" value={selected.rotate || 0} onChange={(e) => updateSelected({ rotate: Number(e.target.value) })} />
                        <Val>{selected.rotate || 0}°</Val>
                      </LabelRow>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Btn onClick={() => moveZ("back")}>⬇️ Enviar atrás</Btn>
                        <Btn onClick={() => moveZ("front")}>⬆️ Traer al frente</Btn>
                        <Btn onClick={duplicateSelected}>🧬 Duplicar</Btn>
                        <Btn onClick={deleteSelected} style={{ color: "#dc2626" }}>
                          🗑️ Eliminar
                        </Btn>
                      </div>
                    </>
                  )}
                </GroupBody>
              )}
            </Group>
          </TwoCols>
        </Below>

        {/* ---------- PREVIEW 360 (LIMPIO) ---------- */}
        {previewOpen && (
          <Overlay
            onClick={() => setPreviewOpen(false)}
            onPointerUp={onPreviewPointerUp}
            onPointerCancel={onPreviewPointerUp}
            onPointerLeave={onPreviewPointerUp}
          >
            <PreviewPanel onClick={(e) => e.stopPropagation()}>
              <PreviewHeader>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <b>Preview 360</b>
                  <Pill>Arrastra para girar</Pill>
                  {previewLoading && <Pill>Generando...</Pill>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Btn onClick={() => setSpin({ rx: 0, ry: 0 })}>↩️ Reset</Btn>
                  <Btn onClick={() => setPreviewOpen(false)}>✖ Cerrar</Btn>
                </div>
              </PreviewHeader>

              <PreviewBody>
                {(() => {
                  const previewW = isMobile ? 320 : 420;
                  const previewH = Math.round(cards.front.height * (previewW / cards.front.width));

                  return (
                    <div
                      onPointerDown={onPreviewPointerDown}
                      onPointerMove={onPreviewPointerMove}
                      style={{
                        width: previewW,
                        height: previewH,
                        perspective: 900,
                        cursor: draggingRef.current ? "grabbing" : "grab",
                        userSelect: "none",
                        touchAction: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          transformStyle: "preserve-3d",
                          transform: `rotateX(${spin.rx}deg) rotateY(${spin.ry}deg) translateZ(0)`,
                          willChange: "transform",
                          transition: draggingRef.current ? "none" : "transform 60ms linear",
                        }}
                      >
                        {/* FRONT PNG */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backfaceVisibility: "hidden",
                            borderRadius: 16,
                            overflow: "hidden",
                            outline: "1px solid var(--border)",
                            background: "#0b1220",
                          }}
                        >
                          {previewImgs.front ? (
                            <img
                              src={previewImgs.front}
                              alt="front"
                              draggable={false}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#cbd5e1" }}>
                              {previewLoading ? "Generando preview..." : "Sin preview"}
                            </div>
                          )}
                        </div>

                        {/* BACK PNG */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            borderRadius: 16,
                            overflow: "hidden",
                            outline: "1px solid var(--border)",
                            background: "#0b1220",
                          }}
                        >
                          {previewImgs.back ? (
                            <img
                              src={previewImgs.back}
                              alt="back"
                              draggable={false}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#cbd5e1" }}>
                              {previewLoading ? "Generando preview..." : "Sin preview"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </PreviewBody>
            </PreviewPanel>
          </Overlay>
        )}

        {/* ---------- CONFIRM ---------- */}
        {confirmUI.open && (
          <ConfirmOverlay onClick={closeConfirm}>
            <ConfirmBox onClick={(e) => e.stopPropagation()}>
              <ConfirmHead>{confirmUI.title}</ConfirmHead>
              <ConfirmBody>{confirmUI.message}</ConfirmBody>
              <ConfirmActions>
                <Btn onClick={closeConfirm}>{confirmUI.cancelText}</Btn>
                {confirmUI.danger ? (
                  <DangerBtn onClick={() => confirmUI.onConfirm?.()}>{confirmUI.confirmText}</DangerBtn>
                ) : (
                  <Btn
                    onClick={() => {
                      confirmUI.onConfirm?.();
                      closeConfirm();
                    }}
                  >
                    {confirmUI.confirmText}
                  </Btn>
                )}
              </ConfirmActions>
            </ConfirmBox>
          </ConfirmOverlay>
        )}

        {/* ---------- TOAST ---------- */}
        {toast && (
          <ToastHost>
            <ToastCard>
              <ToastTop>
                <ToastBadge>
                  {toastIcon(toast.type)} {toast.title}
                </ToastBadge>
                <button onClick={() => setToast(null)} style={{ border: 0, background: "transparent", cursor: "pointer", fontWeight: 900 }}>
                  ✖
                </button>
              </ToastTop>
              <ToastMsg>{toast.message}</ToastMsg>
            </ToastCard>
          </ToastHost>
        )}
      </Wrap>
    </>
  );
}
