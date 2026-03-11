// src/pages/Analytics.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/api";

/* ─── Animations ─────────────────────────────────────────── */
const fadeUp  = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn  = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`from{background-position:200% 0}to{background-position:-200% 0}`;
const countUp = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;
const barIn   = keyframes`from{transform:scaleY(0)}to{transform:scaleY(1)}`;

const Global = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; -webkit-font-smoothing: antialiased; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #f5f5f3;
  color: #111827;
  font-family: 'DM Sans', system-ui, sans-serif;
  padding-bottom: 80px;
`;

/* ─── Top bar ─────────────────────────────────────────────── */
const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  @media(max-width:600px){ padding: 14px 16px; flex-wrap: wrap; gap: 10px; }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #111827;
`;

const Dot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #111827;
`;

const BackBtn = styled.button`
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

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75em;
  font-weight: 600;
  color: ${p => p.$live ? "#059669" : "#9ca3af"};
  &::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${p => p.$live ? "#10b981" : "#d1d5db"};
  }
`;

/* ─── Body ────────────────────────────────────────────────── */
const Body = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeUp} 0.4s ease both;
`;

const PageTitle = styled.h1`
  font-size: 1.6em;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #111827;
  span { color: #10b981; }
`;

const PageSub = styled.p`
  font-size: 0.85em;
  color: #6b7280;
  margin-top: 4px;
`;

/* ─── Actions row ─────────────────────────────────────────── */
const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 4px;
`;

const FilterBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.82em;
  font-weight: 700;
  color: ${p => p.$active ? "#fff" : "#6b7280"};
  background: ${p => p.$active ? "#111827" : "transparent"};
  transition: all 0.18s ease;
  &:hover { color: ${p => p.$active ? "#fff" : "#111827"}; }
`;

const PdfBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.82em;
  font-weight: 700;
  border: 1.5px solid #e5e7eb;
  color: #374151;
  background: #fff;
  transition: all 0.15s;
  &:hover { border-color: #10b981; color: #059669; background: #f0fdf9; }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.4; cursor: default; }
`;

/* ─── Stat cards ──────────────────────────────────────────── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  @media(max-width:560px){ grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  padding: 22px 24px;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${p => p.$color || "#10b981"};
    border-radius: 3px 3px 0 0;
  }
`;

const StatEmoji  = styled.div`font-size: 1.4em; margin-bottom: 10px;`;
const StatLabel  = styled.div`font-size:.7em;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px;`;
const StatValue  = styled.div`font-size:2.6em;font-weight:800;letter-spacing:-2px;color:#111827;line-height:1;font-variant-numeric:tabular-nums;animation:${countUp} .3s ease both;`;
const StatSub    = styled.div`font-size:.72em;color:#9ca3af;margin-top:6px;`;

/* ─── Card ────────────────────────────────────────────────── */
const Card = styled.div`
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  padding: 22px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 10px;
`;

const CardTitle = styled.div`font-size:.8em;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9ca3af;`;
const CardSub   = styled.div`font-size:.78em;color:#6b7280;margin-top:2px;`;

const DayPill = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 0.75em;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1.5px solid #a7f3d0;
  border-radius: 999px;
  padding: 4px 12px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all .15s;
  &:hover { background: #d1fae5; }
`;

/* ─── Chart ───────────────────────────────────────────────── */
const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 110px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  padding-bottom: 2px;
`;

const BarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 24px;
  max-width: 44px;
  cursor: pointer;
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 6px 6px 0 0;
  background: ${p => p.$selected ? "#111827" : p.$h > 0 ? "#10b981" : "#f3f4f6"};
  height: ${p => Math.max(p.$h, p.$h > 0 ? 4 : 3)}px;
  transform-origin: bottom;
  animation: ${barIn} 0.5s cubic-bezier(.4,0,.2,1) both;
  animation-delay: ${p => p.$i * 0.018}s;
  transition: background 0.15s;
  outline: ${p => p.$selected ? "2.5px solid #111827" : "none"};
  outline-offset: 2px;
`;

const BarLabel = styled.div`font-size:.56em;color:#9ca3af;font-weight:600;text-align:center;white-space:nowrap;`;

/* ─── Day insight panel ───────────────────────────────────── */
const InsightPanel = styled.div`
  background: #f0fdf9;
  border: 1.5px solid #a7f3d0;
  border-radius: 16px;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease both;
`;

const InsightTitle = styled.div`
  font-size: .78em;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #059669;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  @media(max-width:500px){ grid-template-columns: 1fr; }
`;

const InsightCard = styled.div`
  background: #fff;
  border: 1px solid #d1fae5;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InsightEmoji = styled.div`
  font-size: 1.6em;
  flex-shrink: 0;
  width: 42px; height: 42px;
  background: ${p => p.$bg || "#ecfdf5"};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InsightInfo = styled.div`flex: 1; min-width: 0;`;
const InsightLabel = styled.div`font-size:.68em;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9ca3af;margin-bottom:2px;`;
const InsightValue = styled.div`font-size:.92em;font-weight:800;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const InsightSub   = styled.div`font-size:.72em;color:#6b7280;margin-top:1px;`;

const InsightStatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
  @media(max-width:500px){ grid-template-columns: repeat(3,1fr); }
`;

const InsightStat = styled.div`
  background: #fff;
  border: 1px solid #d1fae5;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: center;
`;

const InsightStatVal  = styled.div`font-size:1.4em;font-weight:800;color:#059669;letter-spacing:-1px;`;
const InsightStatLbl  = styled.div`font-size:.65em;font-weight:600;color:#9ca3af;margin-top:2px;text-transform:uppercase;letter-spacing:.5px;`;

/* ─── Links ───────────────────────────────────────────────── */
const LinkList = styled.div`display:flex;flex-direction:column;gap:3px;`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 12px;
  transition: background .12s;
  &:hover { background: #f9fafb; }
`;

const LinkRank  = styled.div`font-size:.68em;font-weight:700;color:#d1d5db;width:18px;text-align:right;flex-shrink:0;`;
const LinkIcon  = styled.div`width:34px;height:34px;border-radius:10px;background:${p=>p.$bg||"#f3f4f6"};display:flex;align-items:center;justify-content:center;font-size:1em;flex-shrink:0;`;
const LinkInfo  = styled.div`flex:1;min-width:0;`;
const LinkName  = styled.div`font-size:.85em;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;

const LinkBarWrap = styled.div`width:130px;flex-shrink:0;display:flex;align-items:center;gap:8px;`;
const LinkBarBg   = styled.div`flex:1;height:5px;border-radius:3px;background:#f3f4f6;overflow:hidden;`;
const LinkBarFill = styled.div`height:100%;border-radius:3px;background:${p=>p.$top?"#111827":"#10b981"};width:${p=>p.$pct}%;transition:width .7s cubic-bezier(.4,0,.2,1);`;
const LinkCount   = styled.div`font-size:.88em;font-weight:800;color:#111827;min-width:26px;text-align:right;font-variant-numeric:tabular-nums;`;

/* ─── Misc ────────────────────────────────────────────────── */
const Skeleton = styled.div`
  background: linear-gradient(90deg,#f3f4f6 0%,#e5e7eb 50%,#f3f4f6 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease infinite;
  border-radius: ${p=>p.$r||10}px;
  height: ${p=>p.$h||40}px;
`;

const Empty = styled.div`text-align:center;padding:36px 20px;color:#9ca3af;font-size:.84em;line-height:1.7;`;
const ErrBox = styled.div`background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:12px 16px;border-radius:12px;font-size:.83em;font-weight:600;`;

/* ─── Platform map ────────────────────────────────────────── */
const BRAND = {
  whatsapp:  { color: "#25D366", emoji: "💬", label: "WhatsApp" },
  phone:     { color: "#0ea5e9", emoji: "📞", label: "Teléfono" },
  email:     { color: "#6366f1", emoji: "✉️",  label: "Email" },
  instagram: { color: "#C13584", emoji: "📸", label: "Instagram" },
  tiktok:    { color: "#ff0050", emoji: "🎵", label: "TikTok" },
  facebook:  { color: "#1877F2", emoji: "📘", label: "Facebook" },
  linkedin:  { color: "#0A66C2", emoji: "💼", label: "LinkedIn" },
  youtube:   { color: "#FF0000", emoji: "▶️",  label: "YouTube" },
  website:   { color: "#0ea5e9", emoji: "🌐", label: "Página Web" },
  x:         { color: "#111827", emoji: "𝕏",  label: "X (Twitter)" },
  telegram:  { color: "#229ED9", emoji: "✈️",  label: "Telegram" },
  pdf:       { color: "#6b7280", emoji: "📄", label: "PDF" },
  location:  { color: "#EA4335", emoji: "📍", label: "Ubicación" },
  vcard:     { color: "#8b5cf6", emoji: "📇", label: "Guardar contacto" },
  custom:    { color: "#10b981", emoji: "🔗", label: "Enlace" },
};

const PERIODS = [
  { label: "7D",  days: 7  },
  { label: "15D", days: 15 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000000) return (n/1000000).toFixed(1)+"M";
  if (n >= 1000)    return (n/1000).toFixed(1)+"k";
  return String(n);
}
function fmtDate(dateStr, days) {
  const d = new Date(dateStr+"T00:00:00");
  if (days <= 15) return d.toLocaleDateString("es",{day:"numeric",month:"short"});
  return d.toLocaleDateString("es",{day:"numeric"});
}
function fmtDateLong(dateStr) {
  const d = new Date(dateStr+"T00:00:00");
  return d.toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"});
}
function buildDateRange(days) {
  const arr = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate()-i);
    arr.push(d.toISOString().slice(0,10));
  }
  return arr;
}

/* ─── PDF download (no nueva pestaña) ────────────────────── */
function downloadPDF(clicksList, chartData, days, views, totalClicks, ctr, activeDay, dayInsights) {
  const now   = new Date().toLocaleDateString("es");
  const title = activeDay ? `Analytics · ${fmtDateLong(activeDay)}` : `Analytics · Últimos ${days} días`;
  const maxBar = Math.max(...chartData.map(d => d.value), 1);

  const bars = chartData.map(d => {
    const h = Math.round((d.value / maxBar) * 60);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:18px">
      <div style="width:100%;height:${Math.max(h,d.value>0?3:2)}px;background:${d.value>0?"#10b981":"#f3f4f6"};border-radius:3px 3px 0 0"></div>
      <div style="font-size:9px;color:#9ca3af;white-space:nowrap">${fmtDate(d.date,days)}</div>
    </div>`;
  }).join("");

  const rows = clicksList.map((item,i) => {
    const pct = totalClicks > 0 ? ((item.count/totalClicks)*100).toFixed(1) : 0;
    return `<tr style="background:${i%2===0?"#fff":"#f9fafb"}">
      <td style="color:#10b981;font-weight:800">#${i+1}</td>
      <td>${item.brand.emoji} ${item.brand.label}</td>
      <td style="text-align:right;font-weight:800">${item.count}</td>
      <td style="text-align:right;color:#6b7280">${pct}%</td>
    </tr>`;
  }).join("");

  const insightBlock = dayInsights ? `
    <h2>Resumen del día · ${fmtDateLong(activeDay)}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
      <div style="border:1px solid #d1fae5;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:900;color:#059669">${dayInsights.totalClicks}</div>
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;font-weight:700">Clicks</div>
      </div>
      <div style="border:1px solid #d1fae5;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:900;color:#059669">${dayInsights.views}</div>
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;font-weight:700">Visitas</div>
      </div>
      <div style="border:1px solid #d1fae5;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:900;color:#059669">${dayInsights.linkCount}</div>
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;font-weight:700">Enlaces activos</div>
      </div>
    </div>
    ${dayInsights.top ? `<p style="font-size:12px;color:#374151;margin-bottom:4px">🏆 <b>Más visitado:</b> ${dayInsights.top.brand.emoji} ${dayInsights.top.brand.label} (${dayInsights.top.count} clicks)</p>` : ""}
    ${dayInsights.bottom ? `<p style="font-size:12px;color:#374151;margin-bottom:16px">📉 <b>Menos visitado:</b> ${dayInsights.bottom.brand.emoji} ${dayInsights.bottom.brand.label} (${dayInsights.bottom.count} clicks)</p>` : ""}
    <h2>Clicks por enlace ese día</h2>` : "";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Linkeo Analytics</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;background:#fff;color:#111827;padding:40px;font-size:13px}
  .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;padding-bottom:14px;border-bottom:2px solid #111827}
  .logo{font-size:20px;font-weight:900;color:#111827}
  .meta{font-size:11px;color:#9ca3af}
  h2{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin:24px 0 12px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:4px}
  .stat{border:1.5px solid #e5e7eb;border-radius:14px;padding:16px;position:relative;overflow:hidden}
  .stat::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--c)}
  .stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px}
  .stat-val{font-size:28px;font-weight:900;color:#111827;letter-spacing:-1px}
  table{width:100%;border-collapse:collapse;margin-bottom:4px}
  th{background:#111827;color:#fff;padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
  td{padding:8px 12px;border-bottom:1px solid #f3f4f6}
  .chart{display:flex;align-items:flex-end;gap:4px;height:80px;margin-bottom:4px}
  .footer{margin-top:28px;text-align:center;font-size:10px;color:#d1d5db}
</style></head><body>
<div class="hdr">
  <div class="logo">• LINKEO · Analytics</div>
  <div class="meta">${title} · ${now}</div>
</div>
<div class="stats">
  <div class="stat" style="--c:#10b981"><div class="stat-lbl">Visitas</div><div class="stat-val">${views}</div></div>
  <div class="stat" style="--c:#111827"><div class="stat-lbl">Clicks</div><div class="stat-val">${totalClicks}</div></div>
  <div class="stat" style="--c:#f59e0b"><div class="stat-lbl">CTR</div><div class="stat-val">${ctr}%</div></div>
</div>
${!activeDay ? `<h2>Visitas por día</h2><div class="chart">${bars}</div>` : ""}
${insightBlock}
<table>
  <thead><tr><th>#</th><th>Enlace</th><th style="text-align:right">Clicks</th><th style="text-align:right">%</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">© 2026 Linkeo</div>
</body></html>`;

  // Descarga directa sin abrir pestaña
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `linkeo-analytics-${activeDay || days+"d"}-${new Date().toISOString().slice(0,10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const navigate    = useNavigate();
  const [days,      setDays]      = useState(7);
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [err,       setErr]       = useState("");
  const [live,      setLive]      = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const load = useCallback(async (silent=false, d=null) => {
    if (!silent) setLoading(true);
    setErr("");
    try {
      const period = d || days;
      const json = await authFetch(`/api/analytics/me?days=${period}&t=${Date.now()}`);
      setData(json || {});
      setLive(true);
      setTimeout(() => setLive(false), 1500);
    } catch(e) {
      setErr(e.message || "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
    const iv = setInterval(() => load(true), 15_000);
    const onVis = () => { if (!document.hidden) load(true); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", onVis); };
  }, [load]);

  const handlePeriod = (d) => { setDays(d); setActiveDay(null); load(false, d); };

  /* ── Derive data ── */
  const views       = data?.views       || 0;
  const totalClicks = data?.totalClicks || 0;
  const ctr = views > 0 ? ((totalClicks/views)*100).toFixed(1) : "0.0";
  const clickNames  = data?.clickNames  || {};
  const dailyClicks = data?.dailyClicks || {};
  const dailyViews  = data?.daily       || {};

  /* clicks source: day or total */
  const clicksSource = useMemo(() => {
    if (activeDay && dailyClicks[activeDay]) return dailyClicks[activeDay];
    return data?.clicks || {};
  }, [activeDay, dailyClicks, data]);

  const clicksList = useMemo(() => {
    return Object.entries(clicksSource)
      .map(([key, count]) => {
        const isCustom = key.startsWith("custom_") || key === "custom";
        const brand = isCustom ? BRAND.custom : (BRAND[key] || BRAND.custom);
        const label = clickNames[key] || (isCustom ? "Enlace personalizado" : brand.label) || key;
        return { key, count: Number(count), brand: { ...brand, label } };
      })
      .filter(x => x.count > 0)
      .sort((a,b) => b.count - a.count);
  }, [clicksSource, clickNames]);

  const maxCount = clicksList[0]?.count || 1;

  /* ── Day insights ── */
  const dayInsights = useMemo(() => {
    if (!activeDay) return null;
    const dc = dailyClicks[activeDay] || {};
    const list = Object.entries(dc)
      .map(([key, count]) => {
        const isCustom = key.startsWith("custom_") || key === "custom";
        const brand = isCustom ? BRAND.custom : (BRAND[key] || BRAND.custom);
        const label = clickNames[key] || (isCustom ? "Enlace personalizado" : brand.label) || key;
        return { key, count: Number(count), brand: { ...brand, label } };
      })
      .filter(x => x.count > 0)
      .sort((a,b) => b.count - a.count);

    if (!list.length) return null;

    const top    = list[0];
    const bottom = list.length > 1 ? list[list.length-1] : null;
    const dayViews   = dailyViews[activeDay] || 0;
    const dayClicks  = list.reduce((a,b) => a+b.count, 0);
    const dayCTR     = dayViews > 0 ? ((dayClicks/dayViews)*100).toFixed(1) : "0.0";
    const linkCount  = list.length;
    const avgPerLink = linkCount > 0 ? (dayClicks/linkCount).toFixed(1) : "0";

    return { top, bottom, dayViews, dayClicks, dayCTR, linkCount, avgPerLink, views: dayViews, totalClicks: dayClicks };
  }, [activeDay, dailyClicks, dailyViews, clickNames]);

  /* ── Chart ── */
  const chartData = useMemo(() => {
    const daily = data?.daily || {};
    const dates = buildDateRange(days);
    const maxVal = Math.max(...dates.map(d => daily[d]||0), 1);
    return dates.map((date,i) => ({
      date,
      value:  daily[date] || 0,
      height: Math.round(((daily[date]||0)/maxVal)*95),
      label:  fmtDate(date, days),
      i,
    }));
  }, [data, days]);

  const totalInPeriod = chartData.reduce((a,b) => a+b.value, 0);

  return (
    <>
      <Global />
      <Page>
        {/* ── TopBar ── */}
        <TopBar>
          <BackBtn onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"/>
            </svg>
            Volver
          </BackBtn>
          <LogoWrap><Dot/> LINKEO <span style={{marginLeft:4,fontWeight:400,color:"#6b7280"}}>Analytics</span></LogoWrap>
          <LiveBadge $live={live}>{live ? "Actualizado" : "En vivo"}</LiveBadge>
        </TopBar>

        <Body>
          {err && <ErrBox>❌ {err}</ErrBox>}

          <div>
            <PageTitle>Tu <span>actividad</span></PageTitle>
            <PageSub>Visitas, clicks y evolución día a día.</PageSub>
          </div>

          {/* ── Actions ── */}
          <ActionsRow>
            <FilterRow>
              {PERIODS.map(p => (
                <FilterBtn key={p.days} $active={days===p.days} onClick={() => handlePeriod(p.days)}>
                  {p.label}
                </FilterBtn>
              ))}
            </FilterRow>

            <PdfBtn disabled={loading||!data}
              onClick={() => downloadPDF(clicksList, chartData, days, views, totalClicks, ctr, activeDay, dayInsights)}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6Zm7 1.5L18.5 9H13V3.5ZM8 13h8v1.5H8V13Zm0 3h5v1.5H8V16Z"/>
              </svg>
              Exportar PDF
            </PdfBtn>
          </ActionsRow>

          {/* ── Stats ── */}
          <StatsRow>
            {loading ? (
              <><Skeleton $h={100} $r={20}/><Skeleton $h={100} $r={20}/><Skeleton $h={100} $r={20}/></>
            ) : (<>
              <StatCard $color="#10b981">
                <StatEmoji>👁️</StatEmoji>
                <StatLabel>Visitas al perfil</StatLabel>
                <StatValue key={`v-${views}`}>{fmt(views)}</StatValue>
                <StatSub>últimos {days} días</StatSub>
              </StatCard>
              <StatCard $color="#111827">
                <StatEmoji>🖱️</StatEmoji>
                <StatLabel>Clicks totales</StatLabel>
                <StatValue key={`c-${totalClicks}`}>{fmt(totalClicks)}</StatValue>
                <StatSub>últimos {days} días</StatSub>
              </StatCard>
              <StatCard $color="#f59e0b">
                <StatEmoji>📊</StatEmoji>
                <StatLabel>CTR</StatLabel>
                <StatValue>{ctr}%</StatValue>
                <StatSub>clicks / visitas</StatSub>
              </StatCard>
            </>)}
          </StatsRow>

          {/* ── Chart ── */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Visitas por día</CardTitle>
                <CardSub>{totalInPeriod} visitas en {days} días · <span style={{color:"#10b981",fontWeight:600}}>click en una barra para ver el detalle</span></CardSub>
              </div>
              {activeDay && (
                <DayPill onClick={() => setActiveDay(null)}>
                  {fmtDateLong(activeDay)} · ✕
                </DayPill>
              )}
            </CardHeader>
            {loading ? <Skeleton $h={110} $r={10}/> : (
              <ChartBars>
                {chartData.map((d,i) => (
                  <BarWrap key={d.date} title={`${d.date}: ${d.value} visitas`}
                    onClick={() => setActiveDay(activeDay===d.date ? null : d.date)}>
                    <Bar $h={d.height} $i={i} $selected={activeDay===d.date}/>
                    {(days<=15 || i%Math.ceil(days/10)===0) && <BarLabel>{d.label}</BarLabel>}
                  </BarWrap>
                ))}
              </ChartBars>
            )}
          </Card>

          {/* ── Day insight panel ── */}
          {activeDay && !loading && (
            dayInsights ? (
              <InsightPanel>
                <InsightTitle>
                  <span>📅</span>
                  Resumen · {fmtDateLong(activeDay)}
                </InsightTitle>

                {/* stats row */}
                <InsightStatRow>
                  <InsightStat>
                    <InsightStatVal>{dayInsights.dayViews}</InsightStatVal>
                    <InsightStatLbl>Visitas</InsightStatLbl>
                  </InsightStat>
                  <InsightStat>
                    <InsightStatVal>{dayInsights.dayClicks}</InsightStatVal>
                    <InsightStatLbl>Clicks</InsightStatLbl>
                  </InsightStat>
                  <InsightStat>
                    <InsightStatVal>{dayInsights.dayCTR}%</InsightStatVal>
                    <InsightStatLbl>CTR</InsightStatLbl>
                  </InsightStat>
                </InsightStatRow>

                {/* top / bottom cards */}
                <InsightGrid style={{marginTop:10}}>
                  {dayInsights.top && (
                    <InsightCard>
                      <InsightEmoji $bg="#ecfdf5">{dayInsights.top.brand.emoji}</InsightEmoji>
                      <InsightInfo>
                        <InsightLabel>🏆 Más visitado</InsightLabel>
                        <InsightValue>{dayInsights.top.brand.label}</InsightValue>
                        <InsightSub>{dayInsights.top.count} clicks ese día</InsightSub>
                      </InsightInfo>
                    </InsightCard>
                  )}
                  {dayInsights.bottom && (
                    <InsightCard>
                      <InsightEmoji $bg="#fef9ec">{dayInsights.bottom.brand.emoji}</InsightEmoji>
                      <InsightInfo>
                        <InsightLabel>📉 Menos visitado</InsightLabel>
                        <InsightValue>{dayInsights.bottom.brand.label}</InsightValue>
                        <InsightSub>{dayInsights.bottom.count} clicks ese día</InsightSub>
                      </InsightInfo>
                    </InsightCard>
                  )}
                  <InsightCard>
                    <InsightEmoji $bg="#f5f3ff">🔗</InsightEmoji>
                    <InsightInfo>
                      <InsightLabel>Enlaces activos</InsightLabel>
                      <InsightValue>{dayInsights.linkCount} enlaces</InsightValue>
                      <InsightSub>con al menos 1 click</InsightSub>
                    </InsightInfo>
                  </InsightCard>
                  <InsightCard>
                    <InsightEmoji $bg="#fff7ed">⚡</InsightEmoji>
                    <InsightInfo>
                      <InsightLabel>Promedio por enlace</InsightLabel>
                      <InsightValue>{dayInsights.avgPerLink} clicks</InsightValue>
                      <InsightSub>en este día</InsightSub>
                    </InsightInfo>
                  </InsightCard>
                </InsightGrid>
              </InsightPanel>
            ) : (
              <InsightPanel style={{textAlign:"center",color:"#6b7280",fontSize:"0.85em",padding:"24px"}}>
                Sin actividad registrada este día.
              </InsightPanel>
            )
          )}

          {/* ── Clicks list ── */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{activeDay ? `Clicks · ${fmtDateLong(activeDay)}` : "Clicks por enlace"}</CardTitle>
                {!loading && (
                  <CardSub>{activeDay ? "Solo clicks de este día" : `Top ${clicksList.length} enlaces`}</CardSub>
                )}
              </div>
              {!loading && clicksList.length > 0 && (
                <div style={{fontSize:".75em",fontWeight:700,background:"#ecfdf5",color:"#059669",border:"1.5px solid #a7f3d0",borderRadius:999,padding:"4px 12px",flexShrink:0}}>
                  {clicksList.reduce((a,b)=>a+b.count,0)} clicks
                </div>
              )}
            </CardHeader>
            {loading ? (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[1,2,3].map(k=><Skeleton key={k} $h={46}/>)}
              </div>
            ) : !clicksList.length ? (
              <Empty>{activeDay ? "Sin clicks ese día." : "Sin clicks aún.\nComparte tu perfil para ver datos aquí."}</Empty>
            ) : (
              <LinkList>
                {clicksList.map(({key,count,brand},i) => {
                  const pct = Math.round((count/maxCount)*100);
                  return (
                    <LinkRow key={key}>
                      <LinkRank>#{i+1}</LinkRank>
                      <LinkIcon $bg={`${brand.color}18`}>{brand.emoji}</LinkIcon>
                      <LinkInfo><LinkName>{brand.label}</LinkName></LinkInfo>
                      <LinkBarWrap>
                        <LinkBarBg><LinkBarFill $pct={pct} $top={i===0}/></LinkBarBg>
                        <LinkCount>{fmt(count)}</LinkCount>
                      </LinkBarWrap>
                    </LinkRow>
                  );
                })}
              </LinkList>
            )}
          </Card>

        </Body>
      </Page>
    </>
  );
}
