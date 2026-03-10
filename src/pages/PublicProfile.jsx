// src/pages/PublicProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useParams } from "react-router-dom";
import { API } from "../lib/api";

/* ================= ICONOS ================= */
const Icons = {
  whatsapp: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 2.1 17.3L1 23l5.9-1.6A11 11 0 1 0 20.5 3.5Zm-8.9 16.4c-1.8 0-3.4-.5-4.8-1.5l-.3-.2-3.5.9.9-3.4-.2-.3a8.9 8.9 0 1 1 7.9 4.5Zm4.9-6.7c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.9.9-1.3 2.1-1.3 3.3 0 .4.1.8.2 1.1.3 1 .9 1.9 1.1 2.2.2.3 2.1 3.2 5.1 4.5 3 .1 3.6.1 5.8-2.1.3-.4.4-.8.3-1-.2-.1-.5-.2-.9-.4Z"/></svg>),
  phone:    (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.2.7 3.4.7.7 0 1.2.5 1.2 1.2V20c0 1.1-.9 2-2 2C9.7 22 2 14.3 2 4c0-1.1.9-2 2-2h3.1c.7 0 1.2.5 1.2 1.2 0 1.2.2 2.4.7 3.4.2.4.1.9-.2 1.2L6.6 10.8Z"/></svg>),
  email:    (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>),
  instagram:(p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.5-8.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM20 2H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 18H4V4h16v16Z"/></svg>),
  tiktok:   (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M19 7.8a6.6 6.6 0 0 1-4.2-2V14a5 5 0 1 1-5.6-5 4.9 4.9 0 0 1 1.6.1V11a3 3 0 1 0 2 2.8V2h2.2a4.3 4.3 0 0 0 4.1 3.3V7.8Z"/></svg>),
  facebook: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.8 1.8-1.8H17V2.1A25 25 0 0 0 14.6 2C12 2 10 3.8 10 7.1V10H7v4h3v8h3Z"/></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M6.9 6.8A2.1 2.1 0 1 1 7 2.6a2.1 2.1 0 0 1-.1 4.2ZM3.9 8.7H9v12.4H3.9V8.7ZM13 8.7h4.7v1.8c.7-1.2 2-2.1 4.1-2.1v4.4H21c-2.4 0-2.8 1.1-2.8 2.8v5.6H13V8.7Z"/></svg>),
  youtube:  (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M22 12c0-2.1-.2-3.6-.6-4.5-.3-.8-1-1.4-1.8-1.7C17.9 5.2 12 5.2 12 5.2s-5.9 0-7.6.6A3.1 3.1 0 0 0 2.6 7.5C2.2 8.4 2 9.9 2 12s.2 3.6.6 4.5c.3.8 1 1.4 1.8 1.7 1.7.6 7.6.6 7.6.6s5.9 0 7.6-.6c.8-.3 1.5-.9 1.8-1.7.4-.9.6-2.4.6-4.5ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>),
  website:  (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm6.9 9H15c-.1-2.1-.7-4-1.6-5.6A8 8 0 0 1 18.9 11ZM9 11H5.1A8 8 0 0 1 10.6 5.4C9.7 7 9.1 8.9 9 11Zm0 2c.1 2.1.7 4 1.6 5.6A8 8 0 0 1 5.1 13H9Zm2 0h2c-.1 1.9-.6 3.6-1 4.7-.4-1.1-.9-2.8-1-4.7Zm0-2c.1-1.9.6-3.6 1-4.7.4 1.1.9 2.8 1 4.7h-2Zm2.4 7.6c.9-1.6 1.5-3.5 1.6-5.6h3.9a8 8 0 0 1-5.5 5.6ZM14.9 11c-.1-2.1-.7-4-1.6-5.6A8 8 0 0 1 18.9 11h-4Z"/></svg>),
  x:        (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M4 3h5l3.6 5.1L17 3h3l-5.8 8.1L21 21h-5l-4-5.7L7 21H4l6.3-9L4 3Z"/></svg>),
  telegram: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M9.1 13.1 17.8 7 6.7 11.4l2.4 1.7v4.1l3.1-2.8 3.5 2.5c.4.2.8 0 .9-.5l2.2-10c.1-.6-.4-1.1-1-1L3.6 9.4c-.8.3-.7 1.5.1 1.7l5.4 1.4Z"/></svg>),
  pdf:      (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm2 18H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-7V3.5L18.5 9H13Z"/></svg>),
  custom:   (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 2 9.5 8H3l5.2 3.8L6.6 18 12 14.4 17.4 18l-1.6-6.2L21 8h-6.5L12 2Z"/></svg>),
};

const PLATFORMS = [
  { key: "whatsapp",  name: "WhatsApp",      brand: "#25D366" },
  { key: "phone",     name: "Teléfono",      brand: "#0ea5e9" },
  { key: "email",     name: "Email",         brand: "#0ea5e9" },
  { key: "instagram", name: "Instagram",     brand: "#C13584" },
  { key: "tiktok",    name: "TikTok",        brand: "#000000" },
  { key: "facebook",  name: "Facebook",      brand: "#1877F2" },
  { key: "linkedin",  name: "LinkedIn",      brand: "#0A66C2" },
  { key: "youtube",   name: "YouTube",       brand: "#FF0000" },
  { key: "website",   name: "Página Web",    brand: "#0ea5e9" },
  { key: "x",         name: "X (Twitter)",   brand: "#111111" },
  { key: "telegram",  name: "Telegram",      brand: "#229ED9" },
  { key: "pdf",       name: "PDF",           brand: "#6b7280" },
  { key: "custom",    name: "Personalizado", brand: "#7c3aed" },
];

const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
};
const isValidUrl = (url) => {
  if (!url) return false;
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:") || url.startsWith("blob:")) return true;
  try { new URL(normalizeUrl(url)); return true; } catch { return false; }
};

const FONTS_MAP = [
  { label: "Inter",            css: "Inter:wght@400;600;700" },
  { label: "Poppins",          css: "Poppins:wght@400;600;700" },
  { label: "Montserrat",       css: "Montserrat:wght@400;600;700" },
  { label: "Raleway",          css: "Raleway:wght@400;600;700" },
  { label: "Playfair Display", css: "Playfair+Display:wght@400;600;700" },
  { label: "Roboto",           css: "Roboto:wght@400;700" },
];
function loadFont(family) {
  if (!family || family === "System") return;
  const def = FONTS_MAP.find(f => f.label === family);
  if (!def) return;
  const id = "pp-gfont";
  const el = document.getElementById(id);
  const href = `https://fonts.googleapis.com/css2?family=${def.css}&display=swap`;
  if (el) { el.setAttribute("href", href); return; }
  const l = document.createElement("link");
  l.id = id; l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const blink  = keyframes`0%,100%{opacity:1}50%{opacity:.3}`;

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; -webkit-font-smoothing: antialiased; }
`;

const Page = styled.div`
  position: fixed; inset: 0; overflow-y: auto; overflow-x: hidden;
  color: ${p => p.$color || "#fff"};
  font-family: ${p => p.$fontFamily};
  font-size: ${p => p.$fontSize}px;
  ${p => p.$bgImage ? `
    background-image: ${p.$overlayCss ? p.$overlayCss + "," : ""} url(${p.$bgImage});
    background-size: ${(p.$bgZoom && p.$bgZoom !== 100) ? p.$bgZoom + "%" : "cover"};
    background-position: ${p.$bgPosX ?? 50}% ${p.$bgPosY ?? 50}%;
    background-repeat: no-repeat; background-attachment: scroll;
  ` : `background: ${p.$bgCss || "#0f172a"};`}
`;

const Col = styled.div`
  max-width: 480px; margin: 0 auto;
  padding: ${p => p.$pad}px;
  padding-top:    calc(${p => p.$pad}px + ${p => p.$offset}px + env(safe-area-inset-top,    0px));
  padding-bottom: calc(${p => p.$pad}px +                       env(safe-area-inset-bottom, 0px));
  display: flex; flex-direction: column; gap: ${p => p.$gap}px;
  animation: ${fadeUp} 0.38s ease both;
`;

const AvatarWrap = styled.div`
  display: flex;
  justify-content: ${p => p.$a === "left" ? "flex-start" : p.$a === "right" ? "flex-end" : "center"};
  img { width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.25);box-shadow:0 8px 28px rgba(0,0,0,.35); }
`;
/* ── Avatar Shape System ── */
const HeroBannerWrap = styled.div`
  position: relative;
  width: calc(100% + ${p => p.$pad * 2}px);
  margin-left: -${p => p.$pad}px;
  margin-right: -${p => p.$pad}px;
  height: ${p => p.$height || 160}px;
  overflow: hidden;
  border-radius: ${p => p.$radius || 0}px;
  flex-shrink: 0;
  margin-top: -${p => p.$offset || 0}px;
`;

const AvatarImgLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${p => p.$src});
  background-size: ${p => p.$zoom || 120}%;
  background-position: ${p => p.$x || 50}% ${p => p.$y || 50}%;
  background-repeat: no-repeat;
`;

const HeroBannerGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 35%,
    rgba(0,0,0,${p => p.$opacity || 0.55}) 100%
  );
  pointer-events: none;
`;

const AvatarRectWrap = styled.div`
  display: flex;
  justify-content: ${p => p.$a === 'left' ? 'flex-start' : p.$a === 'right' ? 'flex-end' : 'center'};
`;

const AvatarRect = styled.div`
  position: relative;
  width: ${p => p.$size || 110}px;
  height: ${p => p.$size || 110}px;
  border-radius: ${p => p.$radius || 16}px;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,0.25);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  flex-shrink: 0;
`;
const Bio = styled.div`
  text-align: ${p => p.$a};
  h2 { font-size:1.45em;font-weight:700;letter-spacing:-.3px;line-height:1.15;text-shadow:0 2px 10px rgba(0,0,0,.35);margin-bottom:6px; }
  p  { font-size:.88em;opacity:.85;line-height:1.55;text-shadow:0 1px 5px rgba(0,0,0,.3); }
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: ${p => p.$center ? "center" : "stretch"};
`;

const SocialBtn = styled.a`
  display:flex;align-items:center;gap:10px;text-decoration:none;width:100%;
  padding:13px 16px;border-radius:${p=>p.$r}px;
  border:${p=>`${p.$bw}px solid ${p.$bc}`};background:${p=>p.$bg};color:${p=>p.$tc};
  backdrop-filter:${p=>p.$blur?"blur(10px)":"none"};
  box-shadow:${p=>p.$sh?"0 4px 18px rgba(0,0,0,.22)":"none"};
  flex-direction:${p=>p.$flip?"row-reverse":"row"};
  justify-content:${p=>p.$ca==="center"?"center":p.$ca==="right"?"flex-end":"flex-start"};
  font-size:.93em;font-weight:600;min-width:0;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent;
  &:hover{opacity:.9;transform:translateY(-1px);}&:active{transform:scale(.98);opacity:.85;}
  strong{flex:${p=>p.$ca==="left"?1:"initial"};min-width:0;}
`;

const VCardBtn = styled.button`
  all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;padding:13px 16px;border-radius:14px;
  background:rgba(255,255,255,.13);backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.22);color:inherit;font-size:.93em;font-weight:600;cursor:pointer;
  -webkit-tap-highlight-color:transparent;transition:background .15s;
  &:hover{background:rgba(255,255,255,.22);}&:active{background:rgba(255,255,255,.09);}
`;

const WLabel = styled.div`font-size:.72em;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:.6px;`;

const Carousel = styled.div`border-radius:18px;overflow:hidden;background:rgba(0,0,0,.18);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.1);`;
const Slide = styled.div`
  position:relative;min-height:${p=>p.$img?"200px":"80px"};padding:20px;
  display:flex;flex-direction:column;justify-content:flex-end;gap:5px;
  ${p=>p.$img?`background-image:linear-gradient(to top,rgba(0,0,0,.75) 0%,rgba(0,0,0,.04) 60%),url(${p.$img});background-size:cover;background-position:center;`:"background:rgba(255,255,255,.07);"}
`;
const SlideH = styled.div`font-size:1em;font-weight:700;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6);`;
const SlideP = styled.div`font-size:.84em;color:rgba(255,255,255,.88);line-height:1.45;text-shadow:0 1px 4px rgba(0,0,0,.5);`;
const CtrlRow = styled.div`display:flex;align-items:center;justify-content:space-between;padding:9px 14px 10px;`;
const Dots = styled.div`display:flex;gap:6px;align-items:center;`;
const Dot  = styled.button`all:unset;width:${p=>p.$on?"18px":"7px"};height:7px;border-radius:4px;background:${p=>p.$on?"rgba(255,255,255,.9)":"rgba(255,255,255,.28)"};cursor:pointer;transition:all .2s ease;-webkit-tap-highlight-color:transparent;`;
const Arr  = styled.button`all:unset;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;color:rgba(255,255,255,.9);transition:background .15s;-webkit-tap-highlight-color:transparent;&:hover{background:rgba(255,255,255,.26);}&:disabled{opacity:.22;cursor:default;}`;

const ICard  = styled.div`border-radius:18px;padding:18px;background:${p=>p.$bg||"rgba(255,255,255,.13)"};backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.15);display:flex;align-items:flex-start;gap:14px;`;
const IIcon  = styled.span`font-size:1.8em;line-height:1;flex-shrink:0;`;
const IBody  = styled.div`flex:1;min-width:0;`;
const ITitle = styled.div`font-size:1em;font-weight:700;color:${p=>p.$c||"#fff"};margin-bottom:5px;line-height:1.2;`;
const IText  = styled.div`font-size:.84em;color:${p=>p.$c||"#fff"};opacity:.85;line-height:1.55;`;

const Gallery = styled.div`border-radius:18px;overflow:hidden;background:rgba(255,255,255,.07);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.1);padding:12px;display:flex;flex-direction:column;gap:10px;`;
const GGrid  = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px;`;
const GItem  = styled.div`border-radius:12px;overflow:hidden;background:rgba(255,255,255,.08);cursor:pointer;transition:transform .15s;-webkit-tap-highlight-color:transparent;&:hover{transform:scale(1.02);}&:active{transform:scale(.98);}`;
const GThumb = styled.div`width:100%;aspect-ratio:1;overflow:hidden;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:2em;img{width:100%;height:100%;object-fit:cover;display:block;}`;
const GInfo  = styled.div`padding:7px 9px 9px;`;
const GName  = styled.div`font-size:.78em;font-weight:700;color:${p=>p.$c||"#fff"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const GPrice = styled.div`font-size:.73em;color:${p=>p.$c||"#fff"};opacity:.68;margin-top:2px;`;

const Center = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1018;font-family:system-ui,sans-serif;`;
const Pulse  = styled.div`color:rgba(255,255,255,.45);font-size:15px;animation:${blink} 1.5s ease infinite;`;
const Err    = styled.div`background:rgba(127,29,29,.35);border:1px solid rgba(239,68,68,.35);color:#fecaca;padding:18px 22px;border-radius:16px;max-width:320px;text-align:center;font-size:14px;line-height:1.5;`;

/* =================== vCard =================== */
function buildVCard(theme, links) {
  const esc = s => (s||"").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
  const note = [
    theme.contactNote,
    links.map(l=>`${PLATFORMS.find(x=>x.key===l.key)?.name||l.name||l.key}: ${l.href}`).join("\\n"),
  ].filter(Boolean).join("\\n");
  return [
    "BEGIN:VCARD","VERSION:3.0",
    `FN:${esc(theme.contactFullName||theme.title||"")}`,
    theme.contactOrg     ?`ORG:${esc(theme.contactOrg)}`:null,
    theme.contactTitle   ?`TITLE:${esc(theme.contactTitle)}`:null,
    theme.contactPhone   ?`TEL;TYPE=CELL:${theme.contactPhone.replace(/\s+/g,"")}`:null,
    theme.contactEmail   ?`EMAIL;TYPE=INTERNET:${theme.contactEmail}`:null,
    theme.contactWebsite ?`URL:${theme.contactWebsite}`:null,
    theme.avatarUrl      ?`PHOTO;ENCODING=b;TYPE=JPEG:${(theme.avatarUrl.split(",")[1]||"")}`:null,
    note                 ?`NOTE:${note}`:null,
    "END:VCARD",
  ].filter(Boolean).join("\r\n");
}

/* =================== WIDGETS =================== */
function CarouselWidget({ w }) {
  const slides = w.slides || [];
  const [i, setI] = useState(0);
  if (!slides.length) return null;
  const s = slides[i];
  return (
    <Carousel>
      {w.title && <WLabel style={{ padding: "10px 14px 0" }}>{w.title}</WLabel>}
      <Slide $img={s.imageDataUrl}>
        {s.title && <SlideH>{s.title}</SlideH>}
        {s.text  && <SlideP>{s.text}</SlideP>}
      </Slide>
      {slides.length > 1 && (
        <CtrlRow>
          <Arr onClick={()=>setI(v=>Math.max(0,v-1))} disabled={i===0}>‹</Arr>
          <Dots>{slides.map((_,j)=><Dot key={j} $on={j===i} onClick={()=>setI(j)}/>)}</Dots>
          <Arr onClick={()=>setI(v=>Math.min(slides.length-1,v+1))} disabled={i===slides.length-1}>›</Arr>
        </CtrlRow>
      )}
    </Carousel>
  );
}

function CardWidget({ w }) {
  if (!w.title && !w.text && !w.icon) return null;
  return (
    <ICard $bg={w.bgColor}>
      {w.icon && <IIcon>{w.icon}</IIcon>}
      <IBody>
        {w.title && <ITitle $c={w.textColor}>{w.title}</ITitle>}
        {w.text  && <IText  $c={w.textColor}>{w.text}</IText>}
      </IBody>
    </ICard>
  );
}

function GalleryWidget({ w, tc }) {
  const items = w.items || [];
  if (!items.length) return null;
  return (
    <Gallery>
      {w.title && <WLabel style={{ color: tc }}>{w.title}</WLabel>}
      <GGrid>
        {items.map(item => (
          <GItem key={item.id}>
            <GThumb>{item.imageDataUrl ? <img src={item.imageDataUrl} alt={item.name||""}/> : "🖼"}</GThumb>
            {(item.name||item.price) && (
              <GInfo>
                {item.name  && <GName  $c={tc}>{item.name}</GName>}
                {item.price && <GPrice $c={tc}>{item.price}</GPrice>}
              </GInfo>
            )}
          </GItem>
        ))}
      </GGrid>
    </Gallery>
  );
}
function getTrackingKey(link) {
  if (!link) return "custom";
  if (link.isCustom) return "custom";
  return link.key || "custom";
}
async function trackEvent(slug, type, linkKey = "", linkName = "", linkUrl = "") {
  try {
    await fetch("https://linkeobackend2026-production.up.railway.app/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, type, linkKey, linkName, linkUrl }),
    });
  } catch {
    // silencioso
  }
}
/* =================== PAGE =================== */
export default function PublicProfile() {
  const { slug } = useParams();
  const [doc,     setDoc]     = useState(null);
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true); setErr(""); setDoc(null);
        if (!slug) { setErr("Ruta inválida: falta el slug."); return; }
        const data = await API.getPublicBySlug(slug);
        if (!alive) return;
        if (!data) throw new Error("Respuesta vacía del servidor");
        setDoc(data);
        trackEvent(slug, "profile_view");
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "No se pudo cargar el perfil");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const t  = doc?.theme || {};
  const th = {
    title:           t.title           || doc?.displayName || "",
    description:     t.description     || doc?.bio         || "",
    align:           t.align           ?? "center",
    textColor:       t.textColor       ?? "#FFFFFF",
    avatarAlign:     t.avatarAlign     ?? "center",
    bgMode:          t.bgMode          ?? "solid",
    bgColor:         t.bgColor         ?? "#0f172a",
    bgColor2:        t.bgColor2        ?? "#1e3a8a",
    bgAngle:         t.bgAngle         ?? 180,
    bgImageUrl:      t.bgImageUrl      ?? "",
    overlayOpacity:  t.overlayOpacity  ?? 0.45,
    bgPosX:          t.bgPosX          ?? 50,
    bgPosY:          t.bgPosY          ?? 50,
    bgZoom:          t.bgZoom          ?? 100,
    btnVariant:      t.btnVariant      ?? "filled",
    btnUseBrand:     t.btnUseBrand     ?? false,
    btnBg:           t.btnBg           ?? "#0f172a",
    btnText:         t.btnText         ?? "#ffffff",
    btnBorder:       t.btnBorder       ?? "#ffffff",
    btnBorderWidth:  t.btnBorderWidth  ?? 2,
    btnRadius:       t.btnRadius       ?? 18,
    btnPill:         t.btnPill         ?? true,
    btnShadow:       t.btnShadow       ?? true,
    btnAlign:        t.btnAlign        ?? "stretch",
    btnWidth:        t.btnWidth        ?? 85,
    btnContentAlign: t.btnContentAlign ?? "left",
    btnIconSide:     t.btnIconSide     ?? "left",
    containerPadding:t.containerPadding ?? 20,
    heroOffset:      t.heroOffset       ?? 0,
    linksGap:        t.linksGap         ?? 12,
    fontFamily:      t.fontFamily       ?? "System",
    fontSize:        t.fontSize         ?? 16,
    avatarUrl:       t.avatarUrl        ?? "",
    contactFullName: t.contactFullName  ?? "",
    contactOrg:      t.contactOrg       ?? "",
    contactTitle:    t.contactTitle     ?? "",
    contactPhone:    t.contactPhone     ?? "",
    contactEmail:    t.contactEmail     ?? "",
    contactWebsite:  t.contactWebsite   ?? "",
    contactNote:     t.contactNote      ?? "",
    showVCard:       t.showVCard        ?? true,
    widgets:         Array.isArray(t.widgets) ? t.widgets : [],
    avatarShape:           t.avatarShape           ?? "circle",
avatarPosX:            t.avatarPosX            ?? 50,
avatarPosY:            t.avatarPosY            ?? 50,
avatarZoom:            t.avatarZoom            ?? 120,
avatarHeight:          t.avatarHeight          ?? 160,
avatarRadius:          t.avatarRadius          ?? 0,
avatarGradientOpacity: t.avatarGradientOpacity ?? 0.55,
avatarRectSize:        t.avatarRectSize        ?? 110,
avatarRectRadius:      t.avatarRectRadius      ?? 16,
  };

  useEffect(() => { loadFont(th.fontFamily); }, [th.fontFamily]);

  const font = th.fontFamily === "System"
    ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    : `"${th.fontFamily}", system-ui, sans-serif`;

  const overlay = th.bgMode === "image"
    ? `linear-gradient(${th.bgAngle}deg,rgba(0,0,0,${th.overlayOpacity}) 0%,rgba(0,0,0,${th.overlayOpacity}) 100%)`
    : null;

  const bg = th.bgMode === "gradient"
    ? `linear-gradient(${th.bgAngle}deg,${th.bgColor} 0%,${th.bgColor2} 100%)`
    : th.bgMode === "solid" ? th.bgColor : "#000";

  /* ── Platform links ── */
  const platformLinks = useMemo(() => {
    return (Array.isArray(doc?.links) ? doc.links : [])
      .filter(l => (l?.visible ?? true) && isValidUrl(l?.url))
      .sort((a,b) => (a?.order??9999)-(b?.order??9999))
      .map(l => ({ ...l, href: normalizeUrl(l.url), isCustom: false }));
  }, [doc]);

  /* ── ✅ Custom links from doc.customLinks ── */
  const customLinks = useMemo(() => {
    return (Array.isArray(doc?.customLinks) ? doc.customLinks : [])
      .filter(l => (l?.visible ?? true) && l?.url && l.url.trim())
      .map(l => ({ ...l, href: normalizeUrl(l.url), isCustom: true }));
  }, [doc]);

  /* ── All links combined for vCard ── */
  const allLinks = useMemo(() => {
  const combined = [
    ...platformLinks.map(l => ({ ...l, _sortOrder: l.order ?? 9999 })),
    ...customLinks.map((l, i) => ({ ...l, _sortOrder: l.order ?? (9999 + i) })),
  ];
  return combined.sort((a, b) => a._sortOrder - b._sortOrder);
}, [platformLinks, customLinks]);

  const colors = (key) => {
    const brand = PLATFORMS.find(p=>p.key===key)?.brand || th.btnBg;
    return {
      bg:     th.btnUseBrand ? brand : th.btnBg,
      border: th.btnUseBrand ? brand : th.btnBorder,
      text:   th.btnText,
    };
  };

  const saveVCard = () => {
    const blob = new Blob([buildVCard(th, allLinks)], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(th.contactFullName||th.title||"contacto").replace(/\s+/g,"_")}.vcf`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  if (loading) return <Center><Pulse>Cargando perfil…</Pulse></Center>;
  if (err)     return <Center><Err>❌ {err}</Err></Center>;
  if (!doc)    return <Center><Err>Sin datos</Err></Center>;

  const radius     = th.btnPill ? 999 : th.btnRadius;
  const centerBtnW = th.btnAlign === "center";

  return (
    <>
      <GlobalStyle />
      <Page
        $color={th.textColor} $fontFamily={font} $fontSize={th.fontSize}
        $bgImage={th.bgMode === "image" ? th.bgImageUrl : ""}
        $overlayCss={th.bgMode === "image" ? overlay : ""}
        $bgPosX={th.bgPosX} $bgPosY={th.bgPosY} $bgZoom={th.bgZoom}
        $bgCss={th.bgMode !== "image" ? bg : undefined}
      >
        <Col $pad={th.containerPadding} $offset={th.heroOffset} $gap={th.linksGap}>

     {th.avatarUrl && (() => {
  const shape = th.avatarShape || "circle";

  if (shape === "banner") {
    return (
      <HeroBannerWrap
        $pad={th.containerPadding}
        $height={th.avatarHeight}
        $radius={th.avatarRadius}
        $offset={th.heroOffset}
      >
        <AvatarImgLayer
          $src={th.avatarUrl}
          $zoom={th.avatarZoom}
          $x={th.avatarPosX}
          $y={th.avatarPosY}
        />
        <HeroBannerGradient $opacity={th.avatarGradientOpacity} />
      </HeroBannerWrap>
    );
  }

  if (shape === "rect") {
    return (
      <AvatarRectWrap $a={th.avatarAlign}>
        <AvatarRect $size={th.avatarRectSize} $radius={th.avatarRectRadius}>
          <AvatarImgLayer
            $src={th.avatarUrl}
            $zoom={th.avatarZoom}
            $x={th.avatarPosX}
            $y={th.avatarPosY}
          />
        </AvatarRect>
      </AvatarRectWrap>
    );
  }

  // circle — default
  return (
    <AvatarWrap $a={th.avatarAlign}>
      <div style={{
        position: "relative", width: 96, height: 96,
        borderRadius: "50%", overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.25)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        flexShrink: 0,
      }}>
        <AvatarImgLayer
          $src={th.avatarUrl}
          $zoom={th.avatarZoom}
          $x={th.avatarPosX}
          $y={th.avatarPosY}
        />
      </div>
    </AvatarWrap>
  );
})()}

          <Bio $a={th.align}>
            <h2>{th.title?.trim() || "Tu nombre o marca"}</h2>
        {th.description?.trim() && <p style={{ whiteSpace: 'pre-wrap' }}>{th.description.trim()}</p>}
          </Bio>

   {/* ── Todos los links en orden ── */}
 {allLinks.map((l, i) => {
  const trackingKey = getTrackingKey(l, i);

  if (l.isCustom) {
    const bc =
      th.btnVariant === "outline"
        ? th.btnBorder
        : th.btnUseBrand
        ? "#7c3aed"
        : "transparent";

    const btnBg =
      th.btnVariant === "filled"
        ? th.btnUseBrand
          ? "#7c3aed"
          : th.btnBg
        : th.btnVariant === "glass"
        ? "rgba(255,255,255,.18)"
        : "transparent";

    return (
      <BtnRow key={`custom-${l.id || i}`} $center={centerBtnW}>
        <div style={{ width: centerBtnW ? `${th.btnWidth}%` : "100%", minWidth: 0 }}>
          <SocialBtn
            href={l.href}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent(
                slug,
                "link_click",
                trackingKey,
                l.name || "Enlace",
                l.href
              )
            }
            $r={radius}
            $bw={th.btnBorderWidth}
            $bc={bc}
            $bg={btnBg}
            $tc={th.btnText}
            $blur={th.btnVariant === "glass"}
            $sh={th.btnShadow}
            $flip={th.btnIconSide === "right"}
            $ca={th.btnContentAlign}
          >
            <Icons.custom />
            <strong>{l.name || "Enlace"}</strong>
          </SocialBtn>
        </div>
      </BtnRow>
    );
  }

  const { bg: lbg, border, text } = colors(l.key);
  const Icon = Icons[l.key] || Icons.custom;
  const platformName = PLATFORMS.find((p) => p.key === l.key)?.name || l.key;

  const bc =
    th.btnVariant === "outline"
      ? border
      : th.btnUseBrand
      ? border
      : "transparent";

  const btnBg =
    th.btnVariant === "filled"
      ? lbg
      : th.btnVariant === "glass"
      ? "rgba(255,255,255,.18)"
      : "transparent";

  return (
    <BtnRow key={`${l.key}-${l.id || l.order || i}`} $center={centerBtnW}>
      <div style={{ width: centerBtnW ? `${th.btnWidth}%` : "100%", minWidth: 0 }}>
        <SocialBtn
          href={l.href}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackEvent(
              slug,
              "link_click",
              trackingKey,
              platformName,
              l.href
            )
          }
          $r={radius}
          $bw={th.btnBorderWidth}
          $bc={bc}
          $bg={btnBg}
          $tc={text}
          $blur={th.btnVariant === "glass"}
          $sh={th.btnShadow}
          $flip={th.btnIconSide === "right"}
          $ca={th.btnContentAlign}
        >
          <Icon />
          <strong>{platformName}</strong>
        </SocialBtn>
      </div>
    </BtnRow>
  );
})}
          {/* ── Widgets ── */}
          {th.widgets.map(w => {
            if (w.visible === false) return null;
            if (w.type === "carousel") return <CarouselWidget key={w.id} w={w} />;
            if (w.type === "card")     return <CardWidget     key={w.id} w={w} />;
            if (w.type === "gallery")  return <GalleryWidget  key={w.id} w={w} tc={th.textColor} />;
            return null;
          })}

       
        {/* ── vCard ── */}
{(th.showVCard ?? true) && (() => {
  const bc    = th.btnVariant === "outline" ? th.btnBorder : th.btnUseBrand ? th.btnBorder : "transparent";
  const btnBg = th.btnVariant === "filled"  ? (th.btnUseBrand ? th.btnBg : th.btnBg)
              : th.btnVariant === "glass"   ? "rgba(255,255,255,.18)"
              : "transparent";
  return (
    <BtnRow $center={centerBtnW}>
      <div style={{ width: centerBtnW ? `${th.btnWidth}%` : "100%", minWidth: 0 }}>
        <SocialBtn
          as="button"
      onClick={() => {
  saveVCard();
 trackEvent(slug, "link_click", "vcard", "Guardar contacto", "");
}}
          $r={radius} $bw={th.btnBorderWidth} $bc={bc} $bg={btnBg} $tc={th.btnText}
          $blur={th.btnVariant === "glass"} $sh={th.btnShadow}
          $flip={th.btnIconSide === "right"} $ca={th.btnContentAlign}
          style={{ border: `${th.btnBorderWidth}px solid ${bc}`, cursor: "pointer" }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-1 14H5a1 1 0 0 1-1-1V8l8 5 8-5v9a1 1 0 0 1-1 1ZM12 11 4 6h16l-8 5Z"/>
          </svg>
          <strong>Guardar contacto</strong>
        </SocialBtn>
      </div>
    </BtnRow>
  );
})()}

        </Col>
      </Page>
    </>
  );
}
