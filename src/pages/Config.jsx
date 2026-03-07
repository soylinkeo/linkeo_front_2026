// src/pages/Config.jsx  — versión mejorada
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../lib/api";

/* ================= ICONOS ================= */
const Icons = {
  whatsapp: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 2.1 17.3L1 23l5.9-1.6A11 11 0 1 0 20.5 3.5Zm-8.9 16.4c-1.8 0-3.4-.5-4.8-1.5l-.3-.2-3.5.9.9-3.4-.2-.3a8.9 8.9 0 1 1 7.9 4.5Zm4.9-6.7c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.9.9-1.3 2.1-1.3 3.3 0 .4.1.8.2 1.1.3 1 .9 1.9 1.1 2.2.2.3 2.1 3.2 5.1 4.5 3 .1 3.6.1 5.8-2.1.3-.4.4-.8.3-1-.2-.1-.5-.2-.9-.4Z" />
    </svg>
  ),
  phone: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.2.7 3.4.7.7 0 1.2.5 1.2 1.2V20c0 1.1-.9 2-2 2C9.7 22 2 14.3 2 4c0-1.1.9-2 2-2h3.1c.7 0 1.2.5 1.2 1.2 0 1.2.2 2.4.7 3.4.2.4.1.9-.2 1.2L6.6 10.8Z" /></svg>),
  email: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" /></svg>),
  instagram: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.5-8.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM20 2H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 18H4V4h16v16Z" /></svg>),
  tiktok: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M19 7.8a6.6 6.6 0 0 1-4.2-2V14a5 5 0 1 1-5.6-5 4.9 4.9 0 0 1 1.6.1V11a3 3 0 1 0 2 2.8V2h2.2a4.3 4.3 0 0 0 4.1 3.3V7.8Z" /></svg>),
  facebook: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.8 1.8-1.8H17V2.1A25 25 0 0 0 14.6 2C12 2 10 3.8 10 7.1V10H7v4h3v8h3Z" /></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M6.9 6.8A2.1 2.1 0 1 1 7 2.6a2.1 2.1 0 0 1-.1 4.2ZM3.9 8.7H9v12.4H3.9V8.7ZM13 8.7h4.7v1.8c.7-1.2 2-2.1 4.1-2.1v4.4H21c-2.4 0-2.8 1.1-2.8 2.8v5.6H13V8.7Z" /></svg>),
  youtube: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M22 12c0-2.1-.2-3.6-.6-4.5-.3-.8-1-1.4-1.8-1.7C17.9 5.2 12 5.2 12 5.2s-5.9 0-7.6.6A3.1 3.1 0 0 0 2.6 7.5C2.2 8.4 2 9.9 2 12s.2 3.6.6 4.5c.3.8 1 1.4 1.8 1.7 1.7.6 7.6.6 7.6.6s5.9 0 7.6-.6c.8-.3 1.5-.9 1.8-1.7.4-.9.6-2.4.6-4.5ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>),
  website: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm6.9 9H15c-.1-2.1-.7-4-1.6-5.6A8 8 0 0 1 18.9 11ZM9 11H5.1A8 8 0 0 1 10.6 5.4C9.7 7 9.1 8.9 9 11Zm0 2c.1 2.1.7 4 1.6 5.6A8 8 0 0 1 5.1 13H9Zm2 0h2c-.1 1.9-.6 3.6-1 4.7-.4-1.1-.9-2.8-1-4.7Zm0-2c.1-1.9.6-3.6 1-4.7.4 1.1.9 2.8 1 4.7h-2Zm2.4 7.6c.9-1.6 1.5-3.5 1.6-5.6h3.9a8 8 0 0 1-5.5 5.6ZM14.9 11c-.1-2.1-.7-4-1.6-5.6A8 8 0 0 1 18.9 11h-4Z" /></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M4 3h5l3.6 5.1L17 3h3l-5.8 8.1L21 21h-5l-4-5.7L7 21H4l6.3-9L4 3Z" /></svg>),
  telegram: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M9.1 13.1 17.8 7 6.7 11.4l2.4 1.7v4.1l3.1-2.8 3.5 2.5c.4.2.8 0 .9-.5l2.2-10c.1-.6-.4-1.1-1-1L3.6 9.4c-.8.3-.7 1.5.1 1.7l5.4 1.4Z" /></svg>),
  pdf: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm2 18H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-7V3.5L18.5 9H13Z" /></svg>),
  custom: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path fill="currentColor" d="M12 2 9.5 8H3l5.2 3.8L6.6 18 12 14.4 17.4 18l-1.6-6.2L21 8h-6.5L12 2Z" /></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6h14ZM10 11v6M14 11v6"/></svg>),
  move: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 3v18M3 12h18"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>),
  image: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="3" width="18" height="18" rx="3"/><circle fill="currentColor" cx="8.5" cy="8.5" r="1.5"/><path fill="none" stroke="currentColor" strokeWidth="2" d="M21 15l-5-5L5 21"/></svg>),
  externalLink: (p) => (<svg viewBox="0 0 24 24" width="12" height="12" {...p}><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>),
};

const PLATFORMS = [
  { key: "whatsapp", name: "WhatsApp", brand: "#25D366" },
  { key: "phone", name: "Teléfono", brand: "#0ea5e9" },
  { key: "email", name: "Email", brand: "#0ea5e9" },
  { key: "instagram", name: "Instagram", brand: "#C13584" },
  { key: "tiktok", name: "TikTok", brand: "#000000" },
  { key: "facebook", name: "Facebook", brand: "#1877F2" },
  { key: "linkedin", name: "LinkedIn", brand: "#0A66C2" },
  { key: "youtube", name: "YouTube", brand: "#FF0000" },
  { key: "website", name: "Página Web", brand: "#0ea5e9" },
  { key: "x", name: "X (Twitter)", brand: "#111111" },
  { key: "telegram", name: "Telegram", brand: "#229ED9" },
  { key: "pdf", name: "PDF", brand: "#6b7280" },
  { key: "custom", name: "Personalizado", brand: "#7c3aed" },
];

const PLACEHOLDERS = {
  whatsapp: "https://wa.me/51999999999",
  phone: "tel:+51999999999",
  email: "mailto:tu@correo.com",
  instagram: "https://instagram.com/usuario",
  tiktok: "https://www.tiktok.com/@usuario",
  facebook: "https://facebook.com/tu.pagina",
  linkedin: "https://linkedin.com/in/usuario",
  youtube: "https://youtube.com/@canal",
  website: "https://tu-dominio.com",
  x: "https://x.com/usuario",
  telegram: "https://t.me/usuario",
  pdf: "Sube un PDF o pega una URL",
  custom: "https://enlace-o-protocolo",
};

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

/* ============ STYLED COMPONENTS ============ */
const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const ProfileUrlBanner = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1.5px solid #bae6fd;
  border-radius: 14px;
  margin-bottom: 16px;
  text-decoration: none;
  color: #0369a1;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.15s;
  &:hover { background: linear-gradient(135deg, #e0f2fe, #bae6fd); box-shadow: 0 3px 12px rgba(3,105,161,0.15); }
  span.label {
    font-size: 11px;
    font-weight: 600;
    color: #0284c7;
    background: #e0f2fe;
    border: 1px solid #bae6fd;
    padding: 2px 8px;
    border-radius: 20px;
    flex-shrink: 0;
  }
  span.url {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #0369a1;
  }
  svg { flex-shrink: 0; }
`;

const Wrap = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px 80px;
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: #f5f4f2;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.4px;
  }
`;

const Actions = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`;

const Btn = styled.button`
  padding: 9px 16px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  transition: all 0.15s;
  &:hover { background: #f9fafb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SaveBtn = styled(Btn)`
  background: #111827;
  color: #fff;
  border-color: #111827;
  padding: 10px 22px;
  font-size: 14px;
  width: 100%;
  margin-top: 12px;
  border-radius: 12px;
  &:hover { background: #1f2937; }
`;

const Grid = styled.div`
  display: grid;
  align-items: start;
  gap: 24px;
  grid-template-areas: "phone" "editor";
  grid-template-columns: 1fr;
  @media (min-width: 980px) {
    grid-template-areas: "editor phone";
    grid-template-columns: minmax(0, 1.4fr) 400px;
  }
`;

const EditorCol = styled.div`grid-area: editor;`;
const PhoneCol = styled.div`
  grid-area: phone;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: static;
  @media (min-width: 980px) {
    position: sticky;
    top: 20px;
  }
`;

/* ====== iPhone 15 Pro Frame ====== */
const IPhoneWrapper = styled.div`
  position: relative;
  width: 340px;
  filter: drop-shadow(0 30px 60px rgba(0,0,0,0.35)) drop-shadow(0 8px 20px rgba(0,0,0,0.2));
`;

const IPhoneFrame = styled.div`
  position: relative;
  width: 340px;
  height: 700px;
  border-radius: 50px;
  background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1c 40%, #2d2d30 100%);
  padding: 14px;
  box-sizing: border-box;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50px;
    padding: 1.5px;
    background: linear-gradient(145deg, #5a5a5e, #3a3a3c, #5a5a5e, #2a2a2c);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 120px;
    width: 3px;
    height: 70px;
    background: #3a3a3c;
    border-radius: 0 3px 3px 0;
    box-shadow: 0 90px 0 #3a3a3c;
  }
`;

const VolumeButtons = styled.div`
  position: absolute;
  left: -3px;
  top: 110px;
  width: 3px;
  height: 36px;
  background: #3a3a3c;
  border-radius: 3px 0 0 3px;
  &::before {
    content: '';
    position: absolute;
    top: 50px;
    left: 0;
    width: 3px;
    height: 70px;
    background: #3a3a3c;
    border-radius: 3px 0 0 3px;
  }
  &::after {
    content: '';
    position: absolute;
    top: 135px;
    left: 0;
    width: 3px;
    height: 70px;
    background: #3a3a3c;
    border-radius: 3px 0 0 3px;
  }
`;

const IPhoneScreen = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 38px;
  overflow: hidden;
  position: relative;
  background: ${p => p.$bgCss || '#000'};
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 34px;
  background: #000;
  border-radius: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1a3a6a, #0a1a3a);
    border: 1px solid #1a2a4a;
  }
`;

const ScreenContent = styled.div`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${p => p.$pad}px;
  padding-top: calc(${p => p.$pad}px + 56px + ${p => p.$offset}px);
  
  color: ${p => p.$color || '#fff'};
  font-family: ${p => p.$fontFamily};
  font-size: ${p => p.$fontSize}px;
  
  ${p => p.$bgImage ? `
    background-image: ${p.$overlayCss ? p.$overlayCss + ',' : ''} url(${p.$bgImage});
    background-size: ${(p.$bgZoom && p.$bgZoom !== 100) ? p.$bgZoom + '%' : 'cover'};
    background-position: ${p.$bgPosX || 50}% ${p.$bgPosY || 50}%;
    background-repeat: no-repeat;
    background-attachment: scroll;
  ` : `background: ${p.$bgCss || '#0f172a'};`}
  
  display: flex;
  flex-direction: column;
  gap: ${p => p.$gap}px;
  
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;

const AvatarWrap = styled.div`
  display: flex;
  justify-content: ${p => p.$align === 'left' ? 'flex-start' : p.$align === 'right' ? 'flex-end' : 'center'};
  img {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255,255,255,0.25);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
`;

const Heading = styled.div`
  text-align: ${p => p.$align};
  h2 { margin: 6px 0 4px; font-size: 22px; letter-spacing: -0.3px; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
  p { margin: 0; opacity: 0.85; font-size: 13px; line-height: 1.5; text-shadow: 0 1px 4px rgba(0,0,0,0.3); }
`;

const LinkRow = styled.div`
  display: flex;
  justify-content: ${p => p.$align === 'center' ? 'center' : 'stretch'};
`;

const LinkBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  width: 100%;
  padding: 11px 14px;
  border-radius: ${p => p.$radius}px;
  border: ${p => `${p.$borderWidth}px solid ${p.$border}`};
  background: ${p => p.$variant === 'filled' ? p.$bg : p.$variant === 'glass' ? 'rgba(255,255,255,.18)' : 'transparent'};
  color: ${p => p.$text};
  backdrop-filter: ${p => p.$variant === 'glass' ? 'blur(8px)' : 'none'};
  box-shadow: ${p => p.$shadow ? '0 4px 14px rgba(0,0,0,.2)' : 'none'};
  flex-direction: ${p => p.$iconSide === 'right' ? 'row-reverse' : 'row'};
  justify-content: ${p => p.$contentAlign === 'center' ? 'center' : p.$contentAlign === 'right' ? 'flex-end' : 'flex-start'};
  font-size: 13px;
  font-weight: 600;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
  strong { flex: ${p => p.$contentAlign === 'left' ? 1 : 'initial'}; }
`;

/* ====== Editor Sections ====== */
const Section = styled.div`
  border: 1.5px solid #e8e6e1;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 14px;
  animation: ${fadeIn} 0.2s ease;
`;

const SectionHeader = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 20px;
  cursor: pointer;
  background: #fafaf9;
  border-bottom: 1.5px solid #f0ede8;
  box-sizing: border-box;
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.2px;
  }
`;

const StepNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #111827;
  color: #fff;
  font-weight: 800;
  font-size: 12px;
`;

const ChevronIcon = styled.span`
  font-size: 18px;
  color: #9ca3af;
  transition: transform 0.2s;
  transform: ${p => p.$open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const SectionBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ====== Controls ====== */
const TextInput = styled.input`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid #e8e6e1;
  background: #fafaf9;
  color: #111827;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.15s;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); border-color: #6366f1; background: #fff; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid #e8e6e1;
  background: #fafaf9;
  color: #111827;
  font-size: 14px;
  min-height: 72px;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.15s;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); border-color: #6366f1; background: #fff; }
`;

const SegControl = styled.div`
  display: inline-flex;
  border: 1.5px solid #e8e6e1;
  border-radius: 10px;
  overflow: hidden;
  background: #fafaf9;
  button {
    padding: 7px 13px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    transition: all 0.15s;
    &.active { background: #111827; color: #fff; font-weight: 600; }
    &:hover:not(.active) { background: #f3f4f6; }
  }
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SliderRow = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr 58px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const SliderValue = styled.span`
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: #0f172a;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(to right, #6366f1 ${p => ((p.value - p.min) / (p.max - p.min)) * 100}%, #e2e8f0 0%);
  outline: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6366f1;
    border: 2.5px solid #fff;
    box-shadow: 0 2px 6px rgba(99,102,241,0.4);
    cursor: pointer;
    transition: transform 0.1s;
    &:hover { transform: scale(1.15); }
  }
`;

const ColorSwatch = styled.div`
  position: relative;
  width: 34px; height: 34px;
  border-radius: 10px;
  background: ${p => p.$color};
  border: 2px solid #e5e7eb;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  input[type="color"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%; height: 100%;
  }
`;

const Error = styled.div`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
`;

/* ====== Presets ====== */
const PresetsBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px 0 16px;
`;

const PresetChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  transition: all 0.15s;
  &:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.1); transform: translateY(-1px); }
`;

const SwatchCircle = styled.span`
  width: 18px; height: 18px;
  border-radius: 50%;
  display: inline-block;
  background: ${p => p.$bg};
  border: 1.5px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
`;

/* ====== Image Carousel / Manager ====== */
const ImageManagerWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
`;

const ImgThumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 90px; height: 90px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  border: 3px solid ${p => p.$active ? '#6366f1' : 'transparent'};
  box-shadow: ${p => p.$active ? '0 0 0 1px #6366f1' : '0 2px 8px rgba(0,0,0,0.12)'};
  transition: all 0.18s;
  
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
  
  &:hover .img-overlay { opacity: 1; }
`;

const ImgOverlay = styled.div`
  className: "img-overlay";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s;
`;

const ImgActionBtn = styled.button`
  all: unset;
  width: 28px; height: 28px;
  border-radius: 8px;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  &:hover { background: #fff; }
`;

const AddImageCard = styled.label`
  flex-shrink: 0;
  width: 90px; height: 90px;
  border-radius: 14px;
  border: 2px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s;
  background: #fafaf9;
  input { display: none; }
  &:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
`;

const ActiveImgBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
`;

/* ====== Bg position visual control ====== */
const BgPositionControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  background: #fafaf9;
  border: 1.5px solid #e8e6e1;
  border-radius: 14px;
`;

const PositionPad = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  cursor: crosshair;
  border: 1.5px solid #e8e6e1;
  
  ${p => p.$bgImage ? `
    background-image: url(${p.$bgImage});
    background-size: ${p.$bgZoom || 100}%;
    background-position: ${p.$bgPosX || 50}% ${p.$bgPosY || 50}%;
    background-repeat: no-repeat;
  ` : `background: ${p.$bgCss || '#0f172a'};`}
`;

const PositionHandle = styled.div`
  position: absolute;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2.5px solid #6366f1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  cursor: grab;
  transition: box-shadow 0.15s;
  pointer-events: none;
`;

/* ====== Link Cards ====== */
/* FIX: align-items: start prevents adjacent card from stretching to match height */
/* Two independent columns — no shared row height ever */
const LinkCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: start;
  min-width: 0;
  overflow: hidden;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

/* Each column stacks its own cards independently */
const LinkCardsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
`;

const LinkCard = styled.div`
  border: 1.5px solid #e8e6e1;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  width: 100%;
  min-width: 0;
`;

const LinkCardHeader = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  width: 100%;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  box-sizing: border-box;
  background: ${p => `linear-gradient(135deg, ${p.$brand}, ${p.$brand}bb)`};
`;

const LinkCardBody = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1.5px solid #f0ede8;
  min-width: 0;
  overflow: hidden;
`;

/* FIX: URL preview link shown above the input when a valid URL exists */
const UrlPreviewLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: #f5f3ff;
  border: 1.5px solid #e0e7ff;
  border-radius: 9px;
  color: #6366f1;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  line-height: 1.4;
  transition: background 0.15s;
  &:hover { background: #ede9fe; }
`;

/* ====== Custom Links ====== */
const CustomLinksWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CustomLinkRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr auto auto;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  background: #fafaf9;
  border: 1.5px solid #e8e6e1;
  border-radius: 14px;
`;

const AddCustomBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  background: #fafaf9;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  width: 100%;
  justify-content: center;
  transition: all 0.15s;
  &:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
`;

const SmallIconBtn = styled.button`
  all: unset;
  width: 32px; height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.15s;
  &:hover { background: ${p => p.$danger ? '#fef2f2' : '#f3f4f6'}; color: ${p => p.$danger ? '#dc2626' : '#111'}; }
`;

/* ====== vCard Fields ====== */
const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1fr'};
  gap: 10px;
`;

/* ====== WIDGET STYLED COMPONENTS ====== */
const slideIn = keyframes`from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}`;

const WidgetPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const WidgetTypeBtn = styled.button`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 10px;
  border-radius: 16px;
  border: 2px solid #e8e6e1;
  background: #fafaf9;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-align: center;
  transition: all 0.15s;
  span.icon { font-size: 24px; }
  &:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(99,102,241,0.15); }
`;

const WidgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WidgetItem = styled.div`
  border: 1.5px solid #e8e6e1;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  animation: ${slideIn} 0.2s ease;
`;

const WidgetItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fafaf9;
  border-bottom: 1.5px solid #f0ede8;
  cursor: pointer;
`;

const WidgetItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #111;
`;

const WidgetTypeBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${p => p.$color || '#f1f5f9'};
  color: ${p => p.$textColor || '#6b7280'};
`;

const WidgetItemBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WidgetActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const IconBtn = styled.button`
  all: unset;
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
  background: transparent;
  &:hover { background: #f3f4f6; color: ${p => p.$danger ? '#dc2626' : '#111'}; }
`;

const SlideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SlideItem = styled.div`
  border: 1.5px solid #e8e6e1;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fafaf9;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SlideThumbRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const SlideThumb = styled.div`
  width: 56px; height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 10px;
  border: 1.5px solid #e8e6e1;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const GalleryItemCard = styled.div`
  border: 1.5px solid #e8e6e1;
  border-radius: 12px;
  overflow: hidden;
  background: #fafaf9;
`;

const GalleryThumb = styled.div`
  width: 100%;
  height: 80px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const GalleryItemInfo = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PreviewCarousel = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0,0,0,0.2);
  min-height: 120px;
`;

const CarouselSlide = styled.div`
  position: relative;
  min-height: ${p => p.$hasImage ? '130px' : 'auto'};
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  ${p => p.$bgImage ? `
    background-image: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%), url(${p.$bgImage});
    background-size: cover;
    background-position: center;
  ` : `background: rgba(255,255,255,0.08);`}
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 8px 0 4px;
`;

const Dot = styled.span`
  width: ${p => p.$active ? '16px' : '6px'};
  height: 6px;
  border-radius: 3px;
  background: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.35)'};
  transition: all 0.2s;
`;

const PreviewCard = styled.div`
  border-radius: 14px;
  padding: 14px;
  background: ${p => p.$bg || 'rgba(255,255,255,0.12)'};
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.15);
`;

const PreviewGallery = styled.div`
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GalleryPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => `repeat(${Math.min(p.$cols || 2, 3)}, 1fr)`};
  gap: 6px;
`;

const GalleryPreviewItem = styled.div`
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255,255,255,0.1);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  img { width: 100%; aspect-ratio: 1; object-fit: cover; }
`;

/* ============ DEFAULT STATE ============ */
const DEFAULT_PROFILE = {
  title: "", description: "", align: "center",
  textColor: "#FFFFFF", avatarAlign: "center",
  bgMode: "image", bgColor: "#0f172a", bgColor2: "#1e3a8a",
  bgAngle: 180, bgImages: [], activeBgIndex: 0,
  bgImageDataUrl: "", overlayOpacity: 0.45,
  bgPosX: 50, bgPosY: 50, bgZoom: 100,
  btnVariant: "filled", btnUseBrand: false,
  btnBg: "#0f172a", btnText: "#ffffff", btnBorder: "#ffffff",
  btnBorderWidth: 2, btnRadius: 18, btnPill: true, btnShadow: true,
  btnAlign: "stretch", btnWidth: 85, btnContentAlign: "left", btnIconSide: "left",
  phoneWidth: 340, containerPadding: 18, heroOffset: 0, linksGap: 12,
  fontFamily: "System", fontSize: 16,
  avatarDataUrl: "", pdfDataUrl: "", pdfName: "",
  widgets: [],
  contactFullName: "", contactOrg: "", contactTitle: "",
  contactPhone: "", contactEmail: "", contactWebsite: "",
  contactStreet: "", contactCity: "", contactRegion: "",
  contactPostalCode: "", contactCountry: "", contactNote: "",
  showVCard: true,
  customLinks: [],
};

const FONTS = [
  { label: "System", css: "" },
  { label: "Inter", css: "Inter:wght@400;600;700" },
  { label: "Poppins", css: "Poppins:wght@400;600;700" },
  { label: "Montserrat", css: "Montserrat:wght@400;600;700" },
  { label: "Raleway", css: "Raleway:wght@400;600;700" },
  { label: "Playfair Display", css: "Playfair+Display:wght@400;600;700" },
  { label: "Roboto", css: "Roboto:wght@400;700" },
];

const STYLE_PRESETS = [
  {
    key: "claro", name: "Claro",
    demo: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    patch: { bgMode: "gradient", bgColor: "#f8fafc", bgColor2: "#e2e8f0", textColor: "#111827", btnVariant: "outline", btnUseBrand: false, btnBg: "#ffffff", btnText: "#111827", btnBorder: "#cbd5e1", btnShadow: true },
  },
  {
    key: "vibrante", name: "Vibrante",
    demo: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
    patch: { bgMode: "gradient", bgColor: "#0ea5e9", bgColor2: "#7c3aed", textColor: "#ffffff", btnVariant: "filled", btnUseBrand: false, btnBg: "#111827", btnText: "#ffffff", btnBorder: "#111827", btnShadow: true },
  },
  {
    key: "oscuro", name: "Oscuro",
    demo: "linear-gradient(135deg,#0b1220,#111827)",
    patch: { bgMode: "solid", bgColor: "#0b1220", textColor: "#e5e7eb", btnVariant: "filled", btnBg: "#1f2937", btnText: "#e5e7eb", btnBorder: "#374151", btnShadow: false },
  },
  {
    key: "rose", name: "Rosa",
    demo: "linear-gradient(135deg,#fda4af,#fb7185)",
    patch: { bgMode: "gradient", bgColor: "#fda4af", bgColor2: "#be123c", bgAngle: 160, textColor: "#ffffff", btnVariant: "glass", btnUseBrand: false, btnBg: "#ffffff", btnText: "#ffffff", btnBorder: "rgba(255,255,255,0.5)", btnShadow: true },
  },
  {
    key: "forest", name: "Bosque",
    demo: "linear-gradient(135deg,#14532d,#166534)",
    patch: { bgMode: "gradient", bgColor: "#052e16", bgColor2: "#166534", bgAngle: 135, textColor: "#d1fae5", btnVariant: "glass", btnBg: "transparent", btnText: "#d1fae5", btnBorder: "rgba(209,250,229,0.4)", btnShadow: false },
  },
];

/* =================== MAIN COMPONENT =================== */
export default function Config() {
  const nav = useNavigate();
  const { user, profile: ctxProfile, setProfile: setCtxProfile, isAuthed } = useAuth();

  const STORAGE_KEY = user?.username
    ? `social_tiles_theme_v10_${user.username}`
    : "social_tiles_theme_v10_anon";

  useEffect(() => {
    const oldKeys = ["social_tiles_theme_v9_" + (user?.username || "anon")];
    oldKeys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && raw.length > 2_000_000) localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [STORAGE_KEY]);

  const [items, setItems] = useState(() =>
    PLATFORMS.map(p => ({ key: p.key, url: "", visible: true, open: false }))
  );
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [errors, setErrors] = useState({});
  const [openStep, setOpenStep] = useState(1);
  const [loadingNet, setLoadingNet] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const positionPadRef = useRef(null);

  const activeBgImage = useMemo(() => {
    const imgs = profile.bgImages || [];
    if (imgs.length === 0) return profile.bgImageDataUrl || "";
    return imgs[profile.activeBgIndex ?? 0]?.dataUrl || "";
  }, [profile.bgImages, profile.activeBgIndex, profile.bgImageDataUrl]);

  useEffect(() => {
    loadFromBackend();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) nav("/login", { replace: true, state: { from: { pathname: "/config" } } });
  }, [isAuthed, nav]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        const savedLinks = Array.isArray(saved) ? saved : Array.isArray(saved?.links) ? saved.links : [];
        const merged = PLATFORMS.map(p => savedLinks.find(s => s.key === p.key) || { key: p.key, url: "", visible: true, open: false });
        setItems(merged);
        if (!Array.isArray(saved) && saved?.profile) setProfile(prev => ({ ...prev, ...saved.profile }));
        return;
      } catch {}
    }
    if (ctxProfile) {
      const mapped = fromServerDoc({ theme: ctxProfile.theme, links: ctxProfile.links, displayName: ctxProfile.displayName, bio: ctxProfile.bio });
      setProfile(mapped.profile);
      setItems(mapped.items);
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw && ctxProfile) {
      const mapped = fromServerDoc(ctxProfile);
      setProfile(mapped.profile);
      setItems(mapped.items);
    }
  }, [ctxProfile, STORAGE_KEY]);

  useEffect(() => {
    const safeProfile = {
      ...profile,
      avatarDataUrl: "",
      pdfDataUrl: "",
      bgImageDataUrl: "",
      bgImages: (profile.bgImages || []).map(img => ({ ...img, dataUrl: "" })),
      widgets: (profile.widgets || []).map(w => {
        if (w.type === 'carousel') return { ...w, slides: (w.slides||[]).map(s => ({ ...s, imageDataUrl: "" })) };
        if (w.type === 'gallery') return { ...w, items: (w.items||[]).map(i => ({ ...i, imageDataUrl: "" })) };
        return w;
      }),
    };
    const data = { links: items.map(({ key, url, visible }) => ({ key, url, visible })), profile: safeProfile };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }
  }, [items, profile, STORAGE_KEY]);

  useEffect(() => {
    const def = FONTS.find(f => f.label === profile.fontFamily);
    const id = "designer-font-link";
    const existing = document.getElementById(id);
    if (!def || !def.css) { if (existing) existing.remove(); return; }
    const href = `https://fonts.googleapis.com/css2?family=${def.css}&display=swap`;
    if (existing) existing.setAttribute("href", href);
    else {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    }
  }, [profile.fontFamily]);

  /* ---- Helpers ---- */
  const byKey = k => items.find(i => i.key === k);
  const toggleOpen = k => setItems(prev => prev.map(i => i.key === k ? { ...i, open: !i.open } : { ...i, open: false }));
  const setUrl = (k, url) => setItems(prev => prev.map(i => i.key === k ? { ...i, url } : i));
  const setVisible = (k, v) => setItems(prev => prev.map(i => i.key === k ? { ...i, visible: v } : i));
  const P = (patch) => setProfile(prev => ({ ...prev, ...patch }));

  /* ---- Custom Links ---- */
  const customLinks = profile.customLinks || [];
  const addCustomLink = () => P({ customLinks: [...customLinks, { id: Date.now().toString(), name: '', url: '', visible: true }] });
  const removeCustomLink = (id) => P({ customLinks: customLinks.filter(l => l.id !== id) });
  const updateCustomLink = (id, patch) => P({ customLinks: customLinks.map(l => l.id === id ? { ...l, ...patch } : l) });

  /* ---- Widgets ---- */
  const [previewCarouselIdx, setPreviewCarouselIdx] = useState(0);
  const widgets = profile.widgets || [];

  const addWidget = (type) => {
    const id = Date.now().toString();
    let newW;
    if (type === 'carousel') newW = { id, type: 'carousel', title: '', slides: [{ id: Date.now()+'s', title: '', text: '', imageDataUrl: '' }] };
    else if (type === 'card') newW = { id, type: 'card', title: '✨ Información destacada', text: '', icon: '⭐', bgColor: 'rgba(255,255,255,0.15)', textColor: '#ffffff' };
    else if (type === 'gallery') newW = { id, type: 'gallery', title: '', items: [{ id: Date.now()+'g', name: '', price: '', imageDataUrl: '' }] };
    P({ widgets: [...widgets, newW] });
  };

  const removeWidget = (id) => P({ widgets: widgets.filter(w => w.id !== id) });
  const updateWidget = (id, patch) => P({ widgets: widgets.map(w => w.id === id ? { ...w, ...patch } : w) });

  const moveWidget = (id, dir) => {
    const idx = widgets.findIndex(w => w.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === widgets.length - 1)) return;
    const arr = [...widgets];
    [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
    P({ widgets: arr });
  };

  const addSlide = (wId) => updateWidget(wId, { slides: [...(widgets.find(w=>w.id===wId)?.slides||[]), { id: Date.now()+'s', title: '', text: '', imageDataUrl: '' }] });
  const removeSlide = (wId, sId) => updateWidget(wId, { slides: (widgets.find(w=>w.id===wId)?.slides||[]).filter(s=>s.id!==sId) });
  const updateSlide = (wId, sId, patch) => updateWidget(wId, { slides: (widgets.find(w=>w.id===wId)?.slides||[]).map(s=>s.id===sId?{...s,...patch}:s) });
  const onSlideImage = (wId, sId, file) => { const r=new FileReader(); r.onload=()=>updateSlide(wId,sId,{imageDataUrl:r.result}); r.readAsDataURL(file); };

  const addGalleryItem = (wId) => updateWidget(wId, { items: [...(widgets.find(w=>w.id===wId)?.items||[]), { id: Date.now()+'g', name: '', price: '', imageDataUrl: '' }] });
  const removeGalleryItem = (wId, iId) => updateWidget(wId, { items: (widgets.find(w=>w.id===wId)?.items||[]).filter(i=>i.id!==iId) });
  const updateGalleryItem = (wId, iId, patch) => updateWidget(wId, { items: (widgets.find(w=>w.id===wId)?.items||[]).map(i=>i.id===iId?{...i,...patch}:i) });
  const onGalleryItemImage = (wId, iId, file) => { const r=new FileReader(); r.onload=()=>updateGalleryItem(wId,iId,{imageDataUrl:r.result}); r.readAsDataURL(file); };

  const [openWidgetIds, setOpenWidgetIds] = useState({});
  const toggleWidgetOpen = (id) => setOpenWidgetIds(prev => ({ ...prev, [id]: !prev[id] }));

  const visibleLinks = useMemo(() => {
    const platform = items.filter(i => i.visible && isValidUrl(i.url)).map((i, idx) => ({ ...i, href: normalizeUrl(i.url), order: idx, isCustom: false }));
    const custom = (profile.customLinks || []).filter(l => l.visible && l.url && l.url.trim()).map((l, idx) => ({ key: `custom_${l.id}`, name: l.name || 'Enlace', url: l.url, href: normalizeUrl(l.url), visible: true, order: platform.length + idx, isCustom: true }));
    return [...platform, ...custom];
  }, [items, profile.customLinks]);

  const validateOne = k => {
    const i = byKey(k);
    if (!i) return;
    setErrors(e => ({ ...e, [k]: (i.url ? isValidUrl(i.url) : true) ? "" : "URL inválida" }));
  };

  /* ---- Assets ---- */
  const onAvatarFile = file => {
    const r = new FileReader();
    r.onload = () => P({ avatarDataUrl: r.result });
    r.readAsDataURL(file);
  };

  const onBgImageFiles = (files) => {
    Array.from(files).forEach(file => {
      const r = new FileReader();
      r.onload = () => {
        setProfile(prev => {
          const newImgs = [...(prev.bgImages || []), { dataUrl: r.result, name: file.name }];
          return { ...prev, bgImages: newImgs, bgMode: "image", activeBgIndex: newImgs.length - 1 };
        });
      };
      r.readAsDataURL(file);
    });
  };

  const removeBgImage = (idx) => {
    setProfile(prev => {
      const newImgs = prev.bgImages.filter((_, i) => i !== idx);
      const newIdx = Math.min(prev.activeBgIndex ?? 0, Math.max(0, newImgs.length - 1));
      return { ...prev, bgImages: newImgs, activeBgIndex: newIdx, bgMode: newImgs.length === 0 ? "solid" : "image" };
    });
  };

  const onPdfFile = file => {
    const r = new FileReader();
    r.onload = () => P({ pdfDataUrl: r.result, pdfName: file.name });
    r.readAsDataURL(file);
  };

  /* ---- Bg Position Drag ---- */
  const handlePositionPadClick = useCallback((e) => {
    const pad = positionPadRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    P({ bgPosX: Math.max(0, Math.min(100, x)), bgPosY: Math.max(0, Math.min(100, y)) });
  }, []);

  /* ---- Computed styles ---- */
  const overlayCss = profile.bgMode === "image"
    ? `linear-gradient(${profile.bgAngle}deg, rgba(0,0,0,${profile.overlayOpacity}) 0%, rgba(0,0,0,${profile.overlayOpacity}) 100%)`
    : null;

  const bgCss = profile.bgMode === "gradient"
    ? `linear-gradient(${profile.bgAngle}deg, ${profile.bgColor} 0%, ${profile.bgColor2} 100%)`
    : profile.bgMode === "solid"
    ? profile.bgColor
    : "#000";

  const btnColorsFor = key => {
    const brand = PLATFORMS.find(p => p.key === key)?.brand || profile.btnBg;
    return {
      bg: profile.btnUseBrand ? brand : profile.btnBg,
      border: profile.btnUseBrand ? brand : profile.btnBorder,
      text: profile.btnText,
    };
  };

  const cssFontFamily = profile.fontFamily === "System"
    ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    : `"${profile.fontFamily}", system-ui, sans-serif`;

  const titleText = profile.title?.trim() || "Tu nombre o marca";
  const descText = profile.description?.trim() || "Escribe una breve descripción…";

  /* ---- vCard ---- */
  const escapeV = (s = "") => s.replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const buildVCard = () => {
    const p = profile;
    const socialNote = visibleLinks.map(l => `${PLATFORMS.find(x => x.key === l.key)?.name || l.key}: ${l.href}`).join("\\n");
    const note = [p.contactNote, socialNote].filter(Boolean).join("\\n");
    return [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${escapeV(p.contactFullName || p.title || "")}`,
      p.contactOrg ? `ORG:${escapeV(p.contactOrg)}` : null,
      p.contactTitle ? `TITLE:${escapeV(p.contactTitle)}` : null,
      p.contactPhone ? `TEL;TYPE=CELL:${p.contactPhone.replace(/\s+/g, "")}` : null,
      p.contactEmail ? `EMAIL;TYPE=INTERNET:${p.contactEmail}` : null,
      p.contactWebsite ? `URL:${p.contactWebsite}` : null,
      p.avatarDataUrl ? `PHOTO;ENCODING=b;TYPE=JPEG:${p.avatarDataUrl.split(",")[1] || ""}` : null,
      note ? `NOTE:${note}` : null,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");
  };

  const downloadVCard = () => {
    const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(profile.contactFullName || profile.title || "contacto").replace(/\s+/g, "_")}.vcf`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  /* ---- Backend ---- */
  const toServerPayload = () => {
    // eslint-disable-next-line no-unused-vars
    const { customLinks: _cl, bgImages: _bi, avatarDataUrl: _av, pdfDataUrl: _pdf, bgImageDataUrl: _bgd, widgets: _w, ...themeRest } = profile;
    return {
      displayName: profile.title,
      bio: profile.description,
      theme: { ...themeRest, bgImageUrl: activeBgImage, avatarUrl: profile.avatarDataUrl, pdfUrl: profile.pdfDataUrl },
      links: items.map((i, order) => ({ key: i.key, url: i.url, visible: i.visible, order })),
      customLinks: (profile.customLinks || []).map(({ id, name, url, visible }) => ({ id, name, url, visible })),
    };
  };

  const fromServerDoc = (doc) => {
    const t = doc?.theme || {};
    // customLinks: prefer top-level doc.customLinks, fallback to theme.customLinks
    const restoredCustomLinks = Array.isArray(doc?.customLinks) && doc.customLinks.length > 0
      ? doc.customLinks
      : Array.isArray(t?.customLinks) ? t.customLinks : [];
    const serverProfile = {
      ...DEFAULT_PROFILE, ...t,
      title: t.title || doc?.displayName || "",
      description: t.description || doc?.bio || "",
      bgImageDataUrl: t.bgImageUrl || "",
      avatarDataUrl: t.avatarUrl || "",
      pdfDataUrl: t.pdfUrl || "",
      bgImages: t.bgImages || (t.bgImageUrl ? [{ dataUrl: t.bgImageUrl, name: "fondo.jpg" }] : []),
      customLinks: restoredCustomLinks,
    };
    const serverLinks = Array.isArray(doc?.links) ? doc.links : [];
    const mergedLinks = PLATFORMS.map(p => { const f = serverLinks.find(x => x.key === p.key); return { key: p.key, url: f?.url || "", visible: f?.visible ?? true, open: false }; });
    return { profile: serverProfile, items: mergedLinks };
  };

  const loadFromBackend = async () => {
    try {
      setLoadingNet(true);
      const data = await API.getMeProfile();
      const mapped = fromServerDoc(data);
      setProfile(mapped.profile); setItems(mapped.items);
      setCtxProfile(data);
    } catch (e) {
      alert("❌ Error cargando: " + (e.message || "Desconocido"));
    } finally { setLoadingNet(false); }
  };

  const saveToBackend = async () => {
    try {
      setLoadingNet(true);
      const saved = await API.upsertMeProfile(toServerPayload());
      const mapped = fromServerDoc(saved);
      setProfile(mapped.profile); setItems(mapped.items);
      setCtxProfile(saved);
      alert("✅ Guardado correctamente");
    } catch (e) {
      alert("❌ Error guardando: " + (e.message || "Desconocido"));
    } finally { setLoadingNet(false); }
  };

  const applyPreset = key => { const p = STYLE_PRESETS.find(x => x.key === key); if (p) P(p.patch); };

  if (!isAuthed) return null;

  const bgImages = profile.bgImages || [];

  return (
    <Wrap>
      {user?.username && (
        <ProfileUrlBanner
          href={`${window.location.origin}/${user.username.toLowerCase()}`}
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
          <span className="label">Tu página pública</span>
          <span className="url">{window.location.origin}/{user.username.toLowerCase()}</span>
        </ProfileUrlBanner>
      )}
      <Header>
        <h1>{user ? `✦ Configura tu perfil — ${user.username || user.email}` : "✦ Configura tu perfil"}</h1>
        <Actions>
          <Btn type="button" onClick={loadFromBackend} disabled={loadingNet}>{loadingNet ? "…" : "↻ Recargar"}</Btn>
        </Actions>
      </Header>

      {/* Presets */}
      <PresetsBar>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', marginRight: 4 }}>Estilos rápidos:</span>
        {STYLE_PRESETS.map(p => (
          <PresetChip key={p.key} onClick={() => applyPreset(p.key)}>
            <SwatchCircle $bg={p.demo} /> {p.name}
          </PresetChip>
        ))}
        <PresetChip onClick={() => applyPreset(STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)].key)}>
          🎲 Sorpréndeme
        </PresetChip>
      </PresetsBar>

      <Grid>
        {/* EDITOR */}
        <EditorCol>

          {/* STEP 1: Perfil */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 1 ? 0 : 1)}>
              <h3><StepNum>1</StepNum> Perfil — Avatar, nombre y descripción</h3>
              <ChevronIcon $open={openStep === 1}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 1 && (
              <SectionBody>
                <Row>
                  <Label>Avatar:</Label>
                  <label style={{ cursor: 'pointer' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && onAvatarFile(e.target.files[0])} />
                    <Btn as="span">Subir imagen</Btn>
                  </label>
                  {profile.avatarDataUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={profile.avatarDataUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
                      <Btn as="span" style={{ fontSize: 12, padding: '5px 10px', color: '#dc2626' }} onClick={() => P({ avatarDataUrl: "" })}>Quitar</Btn>
                    </div>
                  )}
                </Row>
                <Row>
                  <Label>Alineación avatar:</Label>
                  <SegControl>
                    {['left','center','right'].map(v => <button key={v} className={profile.avatarAlign === v ? 'active' : ''} onClick={() => P({ avatarAlign: v })}>{v === 'left' ? '←' : v === 'center' ? '↔' : '→'}</button>)}
                  </SegControl>
                </Row>
                <TextInput placeholder="Tu nombre o marca" value={profile.title} onChange={e => P({ title: e.target.value })} />
                <TextArea placeholder="Breve descripción…" value={profile.description} onChange={e => P({ description: e.target.value })} />
                <Row>
                  <Label>Alineación texto:</Label>
                  <SegControl>
                    {['left','center','right'].map(al => <button key={al} className={profile.align === al ? 'active' : ''} onClick={() => P({ align: al })}>{al === 'left' ? 'Izq.' : al === 'center' ? 'Centro' : 'Der.'}</button>)}
                  </SegControl>
                  <Label>Color de texto:</Label>
                  <ColorSwatch $color={profile.textColor}>
                    <input type="color" value={profile.textColor} onChange={e => P({ textColor: e.target.value })} />
                  </ColorSwatch>
                </Row>
              </SectionBody>
            )}
          </Section>

          {/* STEP 2: Fondo */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 2 ? 0 : 2)}>
              <h3><StepNum>2</StepNum> Fondo — Color, degradado o imágenes</h3>
              <ChevronIcon $open={openStep === 2}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 2 && (
              <SectionBody>
                <Row>
                  <Label>Tipo de fondo:</Label>
                  <SegControl>
                    {['solid','gradient','image'].map(m => (
                      m === 'image' ? null :
                      <button key={m} className={profile.bgMode === m ? 'active' : ''} onClick={() => P({ bgMode: m })}>
                        {m === 'solid' ? '⬛ Sólido' : '🎨 Degradado'}
                      </button>
                    ))}
                  </SegControl>
                </Row>

                {(profile.bgMode === 'solid' || profile.bgMode === 'gradient') && (
                  <>
                    <Row>
                      <Label>Color {profile.bgMode === 'gradient' ? 'A:' : ':'}</Label>
                      <ColorSwatch $color={profile.bgColor}>
                        <input type="color" value={profile.bgColor} onChange={e => P({ bgColor: e.target.value })} />
                      </ColorSwatch>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>{profile.bgColor}</span>
                      {profile.bgMode === 'gradient' && (
                        <>
                          <Label>Color B:</Label>
                          <ColorSwatch $color={profile.bgColor2}>
                            <input type="color" value={profile.bgColor2} onChange={e => P({ bgColor2: e.target.value })} />
                          </ColorSwatch>
                          <span style={{ fontSize: 13, color: '#6b7280' }}>{profile.bgColor2}</span>
                        </>
                      )}
                    </Row>
                    {profile.bgMode === 'gradient' && (
                      <SliderRow>
                        <span>Ángulo</span>
                        <RangeInput type="range" min="0" max="360" value={profile.bgAngle} onChange={e => P({ bgAngle: +e.target.value })} />
                        <SliderValue>{profile.bgAngle}°</SliderValue>
                      </SliderRow>
                    )}
                    <div style={{ height: 60, borderRadius: 12, background: bgCss, border: '1.5px solid #e8e6e1', transition: 'background 0.3s' }} />
                  </>
                )}

                {profile.bgMode === 'image' && (
                  <ImageManagerWrap>
                    <Label>Imágenes de fondo ({bgImages.length}):</Label>

                    <CarouselTrack>
                      {bgImages.map((img, idx) => (
                        <ImgThumb key={idx} $active={idx === (profile.activeBgIndex ?? 0)} onClick={() => P({ activeBgIndex: idx })}>
                          <img src={img.dataUrl} alt={img.name || `img-${idx}`} />
                          <ImgOverlay className="img-overlay" style={{ opacity: undefined }}>
                            <ImgActionBtn title="Usar este fondo" onClick={e => { e.stopPropagation(); P({ activeBgIndex: idx }); }}>
                              <Icons.check />
                            </ImgActionBtn>
                            <ImgActionBtn title="Eliminar" onClick={e => { e.stopPropagation(); removeBgImage(idx); }}>
                              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                            </ImgActionBtn>
                          </ImgOverlay>
                          {idx === (profile.activeBgIndex ?? 0) && (
                            <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#6366f1', borderRadius: 4, width: 8, height: 8 }} />
                          )}
                        </ImgThumb>
                      ))}
                      <AddImageCard>
                        <input type="file" accept="image/*" multiple onChange={e => e.target.files && onBgImageFiles(e.target.files)} />
                        <Icons.plus />
                        <span>Agregar</span>
                      </AddImageCard>
                    </CarouselTrack>

                    {bgImages.length > 0 && (
                      <ActiveImgBadge>
                        <Icons.check /> Activa: {bgImages[profile.activeBgIndex ?? 0]?.name || `Imagen ${(profile.activeBgIndex ?? 0) + 1}`}
                      </ActiveImgBadge>
                    )}

                    {bgImages.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 13, background: '#fafaf9', borderRadius: 12, border: '1.5px dashed #e5e7eb' }}>
                        Agrega imágenes de fondo con el botón "+"
                      </div>
                    )}

                    {bgImages.length > 0 && (
                      <BgPositionControl>
                        <Label>📍 Posición y zoom de la imagen activa</Label>
                        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>Haz clic en el visor para mover el punto focal</p>

                        <PositionPad
                          ref={positionPadRef}
                          $bgImage={activeBgImage}
                          $bgPosX={profile.bgPosX}
                          $bgPosY={profile.bgPosY}
                          $bgZoom={profile.bgZoom}
                          onClick={handlePositionPadClick}
                        >
                          <PositionHandle $x={profile.bgPosX} $y={profile.bgPosY} />
                        </PositionPad>

                        <SliderRow>
                          <span>Pos. X</span>
                          <RangeInput type="range" min="0" max="100" value={profile.bgPosX} onChange={e => P({ bgPosX: +e.target.value })} />
                          <SliderValue>{profile.bgPosX}%</SliderValue>
                        </SliderRow>
                        <SliderRow>
                          <span>Pos. Y</span>
                          <RangeInput type="range" min="0" max="100" value={profile.bgPosY} onChange={e => P({ bgPosY: +e.target.value })} />
                          <SliderValue>{profile.bgPosY}%</SliderValue>
                        </SliderRow>
                        <SliderRow>
                          <span>Zoom</span>
                          <RangeInput type="range" min="80" max="250" value={profile.bgZoom} onChange={e => P({ bgZoom: +e.target.value })} />
                          <SliderValue>{profile.bgZoom}%</SliderValue>
                        </SliderRow>
                        <SliderRow>
                          <span>Overlay oscuro</span>
                          <RangeInput type="range" min="0" max="0.9" step="0.05" value={profile.overlayOpacity} onChange={e => P({ overlayOpacity: +e.target.value })} />
                          <SliderValue>{Math.round(profile.overlayOpacity * 100)}%</SliderValue>
                        </SliderRow>
                      </BgPositionControl>
                    )}
                  </ImageManagerWrap>
                )}
              </SectionBody>
            )}
          </Section>

          {/* STEP 3: Tipografía */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 3 ? 0 : 3)}>
              <h3><StepNum>3</StepNum> Tipografía y diseño</h3>
              <ChevronIcon $open={openStep === 3}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 3 && (
              <SectionBody>
                <Row>
                  <Label>Fuente:</Label>
                  <select value={profile.fontFamily} onChange={e => P({ fontFamily: e.target.value })} style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e8e6e1', fontSize: 14, cursor: 'pointer' }}>
                    {FONTS.map(f => <option key={f.label} value={f.label}>{f.label}</option>)}
                  </select>
                </Row>
                <SliderRow><span>Tamaño</span><RangeInput type="range" min="14" max="20" value={profile.fontSize} onChange={e => P({ fontSize: +e.target.value })} /><SliderValue>{profile.fontSize}px</SliderValue></SliderRow>
                <SliderRow><span>Padding</span><RangeInput type="range" min="10" max="36" value={profile.containerPadding} onChange={e => P({ containerPadding: +e.target.value })} /><SliderValue>{profile.containerPadding}px</SliderValue></SliderRow>
                <SliderRow><span>Offset superior</span><RangeInput type="range" min="0" max="140" value={profile.heroOffset} onChange={e => P({ heroOffset: +e.target.value })} /><SliderValue>{profile.heroOffset}px</SliderValue></SliderRow>
                <SliderRow><span>Espacio botones</span><RangeInput type="range" min="4" max="24" value={profile.linksGap} onChange={e => P({ linksGap: +e.target.value })} /><SliderValue>{profile.linksGap}px</SliderValue></SliderRow>
              </SectionBody>
            )}
          </Section>

          {/* STEP 4: Botones */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 4 ? 0 : 4)}>
              <h3><StepNum>4</StepNum> Botones — Estilo y colores</h3>
              <ChevronIcon $open={openStep === 4}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 4 && (
              <SectionBody>
                <Row>
                  <Label>Estilo:</Label>
                  <SegControl>
                    {['filled','outline','glass'].map(v => <button key={v} className={profile.btnVariant === v ? 'active' : ''} onClick={() => P({ btnVariant: v })}>{v}</button>)}
                  </SegControl>
                </Row>
                <Label as="label" style={{ cursor: 'pointer', gap: 8 }}>
                  <input type="checkbox" checked={profile.btnUseBrand} onChange={e => P({ btnUseBrand: e.target.checked })} />
                  Usar color de marca por red social
                </Label>
                {!profile.btnUseBrand && (
                  <Row>
                    <Label>Fondo:</Label><ColorSwatch $color={profile.btnBg}><input type="color" value={profile.btnBg} onChange={e => P({ btnBg: e.target.value })} /></ColorSwatch>
                    <Label>Borde:</Label><ColorSwatch $color={profile.btnBorder}><input type="color" value={profile.btnBorder} onChange={e => P({ btnBorder: e.target.value })} /></ColorSwatch>
                    <Label>Texto:</Label><ColorSwatch $color={profile.btnText}><input type="color" value={profile.btnText} onChange={e => P({ btnText: e.target.value })} /></ColorSwatch>
                  </Row>
                )}
                <Row>
                  <Label as="label" style={{ gap: 6 }}><input type="checkbox" checked={profile.btnPill} onChange={e => P({ btnPill: e.target.checked })} /> Píldora (redondeado total)</Label>
                  <Label as="label" style={{ gap: 6 }}><input type="checkbox" checked={profile.btnShadow} onChange={e => P({ btnShadow: e.target.checked })} /> Sombra</Label>
                </Row>
                {!profile.btnPill && (
                  <SliderRow><span>Radio</span><RangeInput type="range" min="0" max="40" value={profile.btnRadius} onChange={e => P({ btnRadius: +e.target.value })} /><SliderValue>{profile.btnRadius}px</SliderValue></SliderRow>
                )}
                <SliderRow><span>Grosor borde</span><RangeInput type="range" min="0" max="6" value={profile.btnBorderWidth} onChange={e => P({ btnBorderWidth: +e.target.value })} /><SliderValue>{profile.btnBorderWidth}px</SliderValue></SliderRow>
                <Row>
                  <Label>Contenido:</Label>
                  <SegControl>
                    {['left','center','right'].map(v => <button key={v} className={profile.btnContentAlign === v ? 'active' : ''} onClick={() => P({ btnContentAlign: v })}>{v === 'left' ? '←' : v === 'center' ? '↔' : '→'}</button>)}
                  </SegControl>
                  <Label>Icono:</Label>
                  <SegControl>
                    {['left','right'].map(v => <button key={v} className={profile.btnIconSide === v ? 'active' : ''} onClick={() => P({ btnIconSide: v })}>{v === 'left' ? '◀ Izq.' : 'Der. ▶'}</button>)}
                  </SegControl>
                </Row>
                <Row>
                  <Label>Ancho:</Label>
                  <SegControl>
                    {['stretch','center'].map(v => <button key={v} className={profile.btnAlign === v ? 'active' : ''} onClick={() => P({ btnAlign: v })}>{v === 'stretch' ? '↔ 100%' : '⬛ Centrado'}</button>)}
                  </SegControl>
                </Row>
                {profile.btnAlign === 'center' && (
                  <SliderRow><span>% ancho</span><RangeInput type="range" min="50" max="100" value={profile.btnWidth} onChange={e => P({ btnWidth: +e.target.value })} /><SliderValue>{profile.btnWidth}%</SliderValue></SliderRow>
                )}
              </SectionBody>
            )}
          </Section>

          {/* STEP 5: Links */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 5 ? 0 : 5)}>
              <h3><StepNum>5</StepNum> Enlaces por red social</h3>
              <ChevronIcon $open={openStep === 5}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 5 && (
              <SectionBody>
                {/* FIX: align-items: start on LinkCardsGrid prevents the side card
                    from stretching to match the open card's height, which made it
                    look like it was "opening" with empty content */}
                <LinkCardsGrid>
                  {[0, 1].map(col => (
                    <LinkCardsCol key={col}>
                      {PLATFORMS.filter((_, idx) => idx % 2 === col).map(p => {
                        const it = items.find(i => i.key === p.key);
                        const Icon = Icons[p.key] || Icons.custom;
                        return (
                          <LinkCard key={p.key}>
                            <LinkCardHeader $brand={p.brand} onClick={() => toggleOpen(p.key)}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon />{p.name}</span>
                              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: 6 }}>
                                {it?.open ? '▲' : it?.url ? '✓' : 'Editar'}
                              </span>
                            </LinkCardHeader>
                            {it?.open && (
                              <LinkCardBody>
                                {it?.url && it.url.trim().length > 0 && (
                                  <UrlPreviewLink
                                    href={normalizeUrl(it.url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <Icons.externalLink />
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {normalizeUrl(it.url)}
                                    </span>
                                  </UrlPreviewLink>
                                )}
                                <TextInput
                                  type="text"
                                  placeholder={PLACEHOLDERS[p.key]}
                                  value={it?.url || ""}
                                  onChange={e => setUrl(p.key, e.target.value)}
                                  onBlur={() => validateOne(p.key)}
                                />
                                {errors[p.key] && <Error>{errors[p.key]}</Error>}
                                <Label as="label" style={{ fontSize: 13 }}>
                                  <input type="checkbox" checked={it?.visible ?? true} onChange={e => setVisible(p.key, e.target.checked)} />
                                  Visible en tu perfil
                                </Label>
                              </LinkCardBody>
                            )}
                          </LinkCard>
                        );
                      })}
                    </LinkCardsCol>
                  ))}
                </LinkCardsGrid>
              </SectionBody>
            )}
          </Section>

          {/* STEP 5b: Custom Links */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 51 ? 0 : 51)}>
              <h3><StepNum>+</StepNum> Mis enlaces personalizados</h3>
              <ChevronIcon $open={openStep === 51}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 51 && (
              <SectionBody>
                <CustomLinksWrap>
                  {customLinks.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '16px 0' }}>
                      Aún no tienes enlaces personalizados. ¡Agrega el primero!
                    </div>
                  )}
                  {customLinks.map(l => (
                    <CustomLinkRow key={l.id}>
                      <TextInput
                        placeholder="Nombre (ej: Mi tienda)"
                        value={l.name}
                        onChange={e => updateCustomLink(l.id, { name: e.target.value })}
                        style={{ margin: 0 }}
                      />
                      <TextInput
                        placeholder="https://..."
                        value={l.url}
                        onChange={e => updateCustomLink(l.id, { url: e.target.value })}
                        style={{ margin: 0 }}
                      />
                      <SmallIconBtn
                        title={l.visible ? 'Ocultar' : 'Mostrar'}
                        onClick={() => updateCustomLink(l.id, { visible: !l.visible })}
                      >
                        {l.visible
                          ? <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 5C7 5 2.7 8.6 1 13.5 2.7 18.4 7 22 12 22s9.3-3.6 11-8.5C21.3 8.6 17 5 12 5Zm0 13a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>
                          : <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.9 5.1 16.5 6.5A9.8 9.8 0 0 0 12 5C7 5 2.7 8.6 1 13.5c.8 2.3 2.2 4.3 4.1 5.8l-1.5 1.6 1.4 1.4 14-14-1-1.2ZM12 8a5.3 5.3 0 0 1 1.5.2L9.2 12.5A4.4 4.4 0 0 1 9 11.5 3 3 0 0 1 12 8Zm0 9c-2.8 0-5.3-1.5-7-4a9 9 0 0 1 3.5-3.3l-1.3 1.3a5 5 0 0 0 6.1 6.1L12 18.2c0-.1-.1-.2-.1-.3l.1.1Z"/></svg>
                        }
                      </SmallIconBtn>
                      <SmallIconBtn $danger title="Eliminar" onClick={() => removeCustomLink(l.id)}>
                        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M18 6L6 18M6 6l12 12"/></svg>
                      </SmallIconBtn>
                    </CustomLinkRow>
                  ))}
                  <AddCustomBtn type="button" onClick={addCustomLink}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                    Agregar enlace
                  </AddCustomBtn>
                </CustomLinksWrap>
              </SectionBody>
            )}
          </Section>

          {/* STEP 6: Contacto */}
          <Section>
            <SectionHeader onClick={() => setOpenStep(s => s === 6 ? 0 : 6)}>
              <h3><StepNum>6</StepNum> Datos de contacto (vCard)</h3>
              <ChevronIcon $open={openStep === 6}>⌄</ChevronIcon>
            </SectionHeader>
            {openStep === 6 && (
              <SectionBody>
                <Row style={{ justifyContent: 'space-between', background: '#f8fafc', border: '1.5px solid #e8e6e1', borderRadius: 12, padding: '10px 14px' }}>
                  <Label style={{ gap: 8 }}>
                    📇 Mostrar botón "Guardar contacto"
                  </Label>
                  <label style={{ position: 'relative', display: 'inline-flex', width: 42, height: 24, cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" checked={profile.showVCard ?? true} onChange={e => P({ showVCard: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: 24,
                      background: (profile.showVCard ?? true) ? '#6366f1' : '#d1d5db',
                      transition: 'background 0.2s',
                    }} />
                    <span style={{
                      position: 'absolute', top: 3, left: (profile.showVCard ?? true) ? 21 : 3,
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                      transition: 'left 0.2s',
                    }} />
                  </label>
                </Row>
                <Row>
                  <Btn type="button" onClick={() => {
                    const telUrl = byKey("phone")?.url || byKey("whatsapp")?.url || "";
                    let phone = "";
                    if (telUrl.startsWith("tel:")) phone = telUrl.slice(4);
                    else if (/wa\.me\/(\d+)/.test(telUrl)) phone = telUrl.match(/wa\.me\/(\d+)/)[1];
                    const email = (byKey("email")?.url || "").replace(/^mailto:/, "");
                    const website = byKey("website")?.url || "";
                    P({ contactPhone: phone || profile.contactPhone, contactEmail: email || profile.contactEmail, contactWebsite: website || profile.contactWebsite });
                  }}>↩ Rellenar desde enlaces</Btn>
                  <Btn type="button" onClick={downloadVCard}>📇 Descargar vCard</Btn>
                </Row>
                <TextInput placeholder="Nombre completo" value={profile.contactFullName} onChange={e => P({ contactFullName: e.target.value })} />
                <FieldGrid $cols="1fr 1fr">
                  <TextInput placeholder="Empresa / Organización" value={profile.contactOrg} onChange={e => P({ contactOrg: e.target.value })} />
                  <TextInput placeholder="Cargo" value={profile.contactTitle} onChange={e => P({ contactTitle: e.target.value })} />
                </FieldGrid>
                <FieldGrid $cols="1fr 1fr">
                  <TextInput placeholder="Teléfono" value={profile.contactPhone} onChange={e => P({ contactPhone: e.target.value })} />
                  <TextInput placeholder="Email" value={profile.contactEmail} onChange={e => P({ contactEmail: e.target.value })} />
                </FieldGrid>
                <TextInput placeholder="Website" value={profile.contactWebsite} onChange={e => P({ contactWebsite: e.target.value })} />
                <TextInput placeholder="Calle y número" value={profile.contactStreet} onChange={e => P({ contactStreet: e.target.value })} />
                <FieldGrid $cols="1fr 1fr 1fr">
                  <TextInput placeholder="Ciudad" value={profile.contactCity} onChange={e => P({ contactCity: e.target.value })} />
                  <TextInput placeholder="Región" value={profile.contactRegion} onChange={e => P({ contactRegion: e.target.value })} />
                  <TextInput placeholder="País" value={profile.contactCountry} onChange={e => P({ contactCountry: e.target.value })} />
                </FieldGrid>
                <TextArea placeholder="Nota" value={profile.contactNote} onChange={e => P({ contactNote: e.target.value })} />
              </SectionBody>
            )}
          </Section>
        </EditorCol>

        {/* IPHONE PREVIEW */}
        <PhoneCol>
          <IPhoneWrapper>
            <IPhoneFrame>
              <VolumeButtons />
              <IPhoneScreen $bgCss={profile.bgMode !== 'image' ? bgCss : undefined}>
                <DynamicIsland />
                <ScreenContent
                  $pad={profile.containerPadding}
                  $offset={profile.heroOffset}
                  $gap={profile.linksGap}
                  $fontFamily={cssFontFamily}
                  $fontSize={profile.fontSize}
                  $color={profile.textColor}
                  $bgCss={profile.bgMode !== 'image' ? bgCss : undefined}
                  $bgImage={profile.bgMode === 'image' ? activeBgImage : ""}
                  $overlayCss={profile.bgMode === 'image' ? overlayCss : ""}
                  $bgPosX={profile.bgPosX}
                  $bgPosY={profile.bgPosY}
                  $bgZoom={profile.bgZoom}
                >
                  {profile.avatarDataUrl && (
                    <AvatarWrap $align={profile.avatarAlign}>
                      <img src={profile.avatarDataUrl} alt="Avatar" />
                    </AvatarWrap>
                  )}

                  <Heading $align={profile.align}>
                    <h2 style={{ opacity: profile.title ? 1 : 0.6, fontStyle: profile.title ? 'normal' : 'italic' }}>
                      {titleText}
                    </h2>
                    <p style={{ opacity: profile.description ? 1 : 0.6, fontStyle: profile.description ? 'normal' : 'italic' }}>
                      {descText}
                    </p>
                  </Heading>

                  {visibleLinks.length === 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '10px 0' }}>
                      Agrega enlaces para verlos aquí…
                    </div>
                  )}

                  {visibleLinks.map(l => {
                    if (l.isCustom) {
                      const { bg, border, text } = btnColorsFor('custom');
                      const radius = profile.btnPill ? 999 : profile.btnRadius;
                      const br = profile.btnVariant === 'outline' ? border : profile.btnUseBrand ? border : 'transparent';
                      const bgColor = profile.btnVariant === 'filled' ? bg : profile.btnVariant === 'glass' ? 'rgba(255,255,255,.18)' : 'transparent';
                      return (
                        <LinkRow key={`prev-${l.key}`} $align={profile.btnAlign}>
                          <div style={{ width: profile.btnAlign === 'center' ? `${profile.btnWidth}%` : '100%' }}>
                            <LinkBtn
                              href={l.href} target="_blank" rel="noreferrer"
                              $variant={profile.btnVariant} $bg={bgColor} $border={br}
                              $borderWidth={profile.btnBorderWidth} $text={text} $radius={radius}
                              $shadow={profile.btnShadow} $iconSide={profile.btnIconSide} $contentAlign={profile.btnContentAlign}
                            >
                              <Icons.custom /><strong>{l.name}</strong>
                            </LinkBtn>
                          </div>
                        </LinkRow>
                      );
                    }
                    const { bg, border, text } = btnColorsFor(l.key);
                    const Icon = Icons[l.key] || Icons.custom;
                    const radius = profile.btnPill ? 999 : profile.btnRadius;
                    const br = profile.btnVariant === 'outline' ? border : profile.btnUseBrand ? border : 'transparent';
                    const bgColor = profile.btnVariant === 'filled' ? bg : profile.btnVariant === 'glass' ? 'rgba(255,255,255,.18)' : 'transparent';
                    return (
                      <LinkRow key={`prev-${l.key}`} $align={profile.btnAlign}>
                        <div style={{ width: profile.btnAlign === 'center' ? `${profile.btnWidth}%` : '100%' }}>
                          <LinkBtn
                            href={l.href} target="_blank" rel="noreferrer"
                            $variant={profile.btnVariant} $bg={bgColor} $border={br}
                            $borderWidth={profile.btnBorderWidth} $text={text} $radius={radius}
                            $shadow={profile.btnShadow} $iconSide={profile.btnIconSide} $contentAlign={profile.btnContentAlign}
                          >
                            <Icon /><strong>{PLATFORMS.find(p => p.key === l.key)?.name || l.key}</strong>
                          </LinkBtn>
                        </div>
                      </LinkRow>
                    );
                  })}

                  {/* WIDGETS PREVIEW */}
                  {widgets.map(w => {
                    if (w.visible === false) return null;
                    if (w.type === 'carousel') {
                      return null;
                    }
                    if (w.type === 'card') {
                      return (
                        <PreviewCard key={w.id} $bg={w.bgColor}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            {w.icon && <span style={{ fontSize: 22, lineHeight: 1 }}>{w.icon}</span>}
                            <div style={{ flex: 1 }}>
                              {w.title && <div style={{ fontSize: 14, fontWeight: 700, color: w.textColor || '#fff', marginBottom: 4 }}>{w.title}</div>}
                              {w.text && <div style={{ fontSize: 12, color: w.textColor || '#fff', opacity: 0.85, lineHeight: 1.5 }}>{w.text}</div>}
                            </div>
                          </div>
                        </PreviewCard>
                      );
                    }
                    if (w.type === 'gallery') {
                      const galleryItems = w.items || [];
                      return (
                        <PreviewGallery key={w.id}>
                          {w.title && <div style={{ fontSize: 12, fontWeight: 700, color: profile.textColor, opacity: 0.85, paddingBottom: 4 }}>{w.title}</div>}
                          <GalleryPreviewGrid $cols={Math.min(galleryItems.length, 2)}>
                            {galleryItems.slice(0, 4).map(item => (
                              <GalleryPreviewItem key={item.id}>
                                {item.imageDataUrl
                                  ? <img src={item.imageDataUrl} alt={item.name} />
                                  : <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🖼</div>
                                }
                                {(item.name || item.price) && (
                                  <div style={{ padding: '5px 7px' }}>
                                    {item.name && <div style={{ fontSize: 10, fontWeight: 700, color: profile.textColor, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>}
                                    {item.price && <div style={{ fontSize: 10, color: profile.textColor, opacity: 0.7 }}>{item.price}</div>}
                                  </div>
                                )}
                              </GalleryPreviewItem>
                            ))}
                          </GalleryPreviewGrid>
                        </PreviewGallery>
                      );
                    }
                    return null;
                  })}

                  {(profile.showVCard ?? true) && (
                    <div
                      onClick={downloadVCard}
                      style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: profile.textColor, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      📇 Guardar contacto
                    </div>
                  )}
                </ScreenContent>
              </IPhoneScreen>
            </IPhoneFrame>
          </IPhoneWrapper>

          <div style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', textAlign: 'center', fontWeight: 500 }}>
            Vista previa iPhone 15 Pro
          </div>

          <SaveBtn type="button" onClick={saveToBackend} disabled={loadingNet}>
            {loadingNet ? "Guardando…" : "💾 Guardar cambios"}
          </SaveBtn>
        </PhoneCol>
      </Grid>
    </Wrap>
  );
}
