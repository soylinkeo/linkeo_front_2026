// src/pages/Analytics.jsx
import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/api";

const fadeUp  = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`from{background-position:200% 0}to{background-position:-200% 0}`;
const countUp = keyframes`from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}`;

const Global = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; -webkit-font-smoothing: antialiased; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #080c14;
  color: #e8edf5;
  font-family: 'DM Sans', system-ui, sans-serif;
  padding: 0 0 80px;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(8,12,20,0.92);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
  @media (max-width: 480px) { flex-wrap: wrap; gap: 12px; padding: 16px; }
`;

const Logo = styled.div`
  font-size: 1.15em;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #fff;
  span { color: #6ee7b7; }
`;

const BackBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.85em;
  color: rgba(255,255,255,0.5);
  transition: color 0.15s;
  &:hover { color: #fff; }
`;

const RefreshBadge = styled.div`
  font-size: 0.75em;
  color: ${p => p.$live ? "#6ee7b7" : "rgba(255,255,255,0.25)"};
  display: flex;
  align-items: center;
  gap: 5px;
  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${p => p.$live ? "#6ee7b7" : "rgba(255,255,255,0.2)"};
    ${p => p.$live ? "box-shadow: 0 0 6px #6ee7b7;" : ""}
  }
`;

const Body = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeUp} 0.4s ease both;
`;

/* ── Stat Cards ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  @media(max-width:580px){ grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${p => p.$accent || "rgba(110,231,183,0.4)"}, transparent);
  }
`;

const StatLabel = styled.div`
  font-size: 0.72em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.4);
`;

const StatValue = styled.div`
  font-size: 2.6em;
  font-weight: 700;
  letter-spacing: -1.5px;
  color: #fff;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  animation: ${countUp} 0.3s ease both;
`;

/* ── Section ── */
const Section = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
`;

const SectionHead = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.div`
  font-size: 0.82em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: rgba(255,255,255,0.45);
`;

const SectionBody = styled.div`padding: 12px;`;

/* ── Link rows ── */
const LinkList = styled.div`display: flex; flex-direction: column; gap: 2px;`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  transition: background 0.12s;
  &:hover { background: rgba(255,255,255,0.05); }
`;

const LinkRank = styled.div`
  font-size: 0.72em;
  color: rgba(255,255,255,0.2);
  width: 18px;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

const LinkIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${p => p.$bg || "rgba(255,255,255,0.08)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95em;
  flex-shrink: 0;
`;

const LinkInfo = styled.div`flex: 1; min-width: 0;`;

const LinkName = styled.div`
  font-size: 0.88em;
  font-weight: 600;
  color: #e8edf5;
  text-transform: capitalize;
`;

const LinkBarWrap = styled.div`
  width: 130px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LinkBarBg = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: rgba(255,255,255,0.07);
  overflow: hidden;
`;

const LinkBarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #059669, #6ee7b7);
  width: ${p => p.$pct}%;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
`;

const LinkCount = styled.div`
  font-size: 0.9em;
  font-weight: 700;
  color: #6ee7b7;
  min-width: 32px;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  transition: all 0.3s ease;
`;

/* ── Skeleton / Empty / Error ── */
const Skeleton = styled.div`
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s ease infinite;
  border-radius: ${p => p.$r || 12}px;
  height: ${p => p.$h || 40}px;
  width: ${p => p.$w || "100%"};
`;

const Empty = styled.div`
  text-align: center;
  padding: 36px 20px;
  color: rgba(255,255,255,0.22);
  font-size: 0.85em;
`;

const ErrBox = styled.div`
  background: rgba(127,29,29,.25);
  border: 1px solid rgba(239,68,68,.25);
  color: #fca5a5;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 0.85em;
`;

/* ── Platform map ── */
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
  x:         { color: "#e2e8f0", emoji: "𝕏",  label: "X (Twitter)" },
  telegram:  { color: "#229ED9", emoji: "✈️",  label: "Telegram" },
  pdf:       { color: "#6b7280", emoji: "📄", label: "PDF" },
  location:  { color: "#EA4335", emoji: "📍", label: "Ubicación" },
  vcard:     { color: "#8b5cf6", emoji: "📇", label: "Guardar contacto" },
  custom:    { color: "#7c3aed", emoji: "🔗", label: "Enlace" },
};

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

/* ════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const navigate  = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState("");
  const [live,    setLive]    = useState(false);

const load = useCallback(async (silent = false) => {
  if (!silent) setLoading(true);
  setErr("");
  try {
    const json = await authFetch("/api/analytics/me");
    setData(json || {});
    setLive(true);
    setTimeout(() => setLive(false), 1500);
  } catch (e) {
    setErr(e.message || "No se pudo cargar");
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    load();
    // Refresca cada 15 segundos en silencio (sin spinner)
    const interval = setInterval(() => load(true), 15_000);
    // También refresca al volver a la pestaña
    const onVisible = () => { if (!document.hidden) load(true); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  /* ── Derivar datos ── */
  const views       = data?.views       || 0;
  const totalClicks = data?.totalClicks || 0;
  const ctr = views > 0 ? ((totalClicks / views) * 100).toFixed(1) : "0.0";

  // clicks = { whatsapp: 5, instagram: 3 } → array ordenado
const clicksList = data?.clicks
  ? Object.entries(data.clicks)
      .map(([key, count]) => {
        const isCustom = key.startsWith("custom_");
        const brand = isCustom
          ? { color: "#7c3aed", emoji: "🔗", label: key.replace("custom_", "Enlace ") }
          : (BRAND[key] || BRAND.custom);
        return { key, count: Number(count), brand };
      })
      .sort((a, b) => b.count - a.count)
  : [];

  const maxCount = clicksList[0]?.count || 1;

  return (
    <>
      <Global />
      <Page>
        <TopBar>
          <BackBtn onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"/>
            </svg>
            Volver
          </BackBtn>

          <Logo>link<span>eo</span> · analytics</Logo>

          <RefreshBadge $live={live}>
            {live ? "Actualizado" : "En vivo · 15s"}
          </RefreshBadge>
        </TopBar>

        <Body>
          {err && <ErrBox>❌ {err}</ErrBox>}

          {/* ── Stat Cards ── */}
          <StatsRow>
            {loading ? (
              <>
                <Skeleton $h={100} $r={20} />
                <Skeleton $h={100} $r={20} />
                <Skeleton $h={100} $r={20} />
              </>
            ) : (
              <>
                <StatCard $accent="rgba(96,165,250,0.5)">
                  <StatLabel>Visitas al perfil</StatLabel>
                  <StatValue key={views}>{fmt(views)}</StatValue>
                </StatCard>

                <StatCard $accent="rgba(110,231,183,0.5)">
                  <StatLabel>Clicks totales</StatLabel>
                  <StatValue key={totalClicks}>{fmt(totalClicks)}</StatValue>
                </StatCard>

                <StatCard $accent="rgba(251,191,36,0.4)">
                  <StatLabel>CTR</StatLabel>
                  <StatValue>{ctr}%</StatValue>
                </StatCard>
              </>
            )}
          </StatsRow>

          {/* ── Clicks por red social ── */}
          <Section>
            <SectionHead>
              <SectionTitle>Clicks por enlace</SectionTitle>
              {!loading && (
                <div style={{ fontSize: "0.75em", color: "rgba(255,255,255,0.22)" }}>
                  {clicksList.length} {clicksList.length === 1 ? "enlace" : "enlaces"}
                </div>
              )}
            </SectionHead>

            <SectionBody>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
                  {[1,2,3].map(k => <Skeleton key={k} $h={48} $r={12} />)}
                </div>
              ) : !clicksList.length ? (
                <Empty>
                  Aún no hay clicks registrados.<br/>
                  Comparte tu perfil para empezar a ver datos.
                </Empty>
              ) : (
                <LinkList>
                  {clicksList.map(({ key, count }, i) => {
                    const brand = BRAND[key] || BRAND.custom;
                    const pct   = Math.round((count / maxCount) * 100);
                    return (
                      <LinkRow key={key}>
                        <LinkRank>#{i + 1}</LinkRank>
                        <LinkIcon $bg={`${brand.color}20`}>
                          {brand.emoji}
                        </LinkIcon>
                        <LinkInfo>
                          <LinkName>{brand.label || key}</LinkName>
                        </LinkInfo>
                        <LinkBarWrap>
                          <LinkBarBg>
                            <LinkBarFill $pct={pct} />
                          </LinkBarBg>
                          <LinkCount key={count}>{fmt(count)}</LinkCount>
                        </LinkBarWrap>
                      </LinkRow>
                    );
                  })}
                </LinkList>
              )}
            </SectionBody>
          </Section>

        </Body>
      </Page>
    </>
  );
}
