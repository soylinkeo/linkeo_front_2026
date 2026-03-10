// src/components/ToastContainer.jsx
import React from "react";
import styled, { keyframes, css } from "styled-components";

const slideIn = keyframes`
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0);    opacity: 1; max-height: 120px; margin-bottom: 10px; }
  to   { transform: translateX(110%); opacity: 0; max-height: 0;     margin-bottom: 0;   }
`;

const COLORS = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", icon: "#16a34a", bar: "#22c55e", title: "#14532d", text: "#166534" },
  error:   { bg: "#fff1f2", border: "#fecdd3", icon: "#dc2626", bar: "#ef4444", title: "#7f1d1d", text: "#991b1b" },
  warning: { bg: "#fffbeb", border: "#fde68a", icon: "#d97706", bar: "#f59e0b", title: "#78350f", text: "#92400e" },
  info:    { bg: "#f0f9ff", border: "#bae6fd", icon: "#0284c7", bar: "#38bdf8", title: "#0c4a6e", text: "#0369a1" },
};

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12l3 3 5-6"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M15 9l-6 6M9 9l6 6"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.5L2 19h20L13.7 3.5a2 2 0 0 0-3.4 0Z"/>
      <path d="M12 10v4M12 17.5v.5"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 11v5M12 8v.5"/>
    </svg>
  ),
};

const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  width: 340px;
  max-width: calc(100vw - 32px);
`;

const ToastItem = styled.div`
  pointer-events: all;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px 16px;
  background: ${p => COLORS[p.$type].bg};
  border: 1.5px solid ${p => COLORS[p.$type].border};
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
  animation: ${p => p.$leaving
    ? css`${slideOut} 0.35s cubic-bezier(0.4,0,1,1) forwards`
    : css`${slideIn} 0.4s cubic-bezier(0.16,1,0.3,1) forwards`
  };
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: ${p => COLORS[p.$type].bar};
  opacity: 0.5;
  transform-origin: left;
  animation: shrink ${p => p.$duration}ms linear forwards;
  @keyframes shrink {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
`;

const IconWrap = styled.div`
  flex-shrink: 0;
  color: ${p => COLORS[p.$type].icon};
  margin-top: 1px;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${p => COLORS[p.$type].title};
  letter-spacing: -0.2px;
  line-height: 1.3;
`;

const Message = styled.div`
  font-size: 13px;
  color: ${p => COLORS[p.$type].text};
  margin-top: 3px;
  line-height: 1.5;
  opacity: 0.9;
`;

const CloseBtn = styled.button`
  all: unset;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${p => COLORS[p.$type].icon};
  opacity: 0.5;
  transition: opacity 0.15s, background 0.15s;
  margin-top: -1px;
  &:hover {
    opacity: 1;
    background: rgba(0,0,0,0.06);
  }
`;

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <Wrapper>
      {toasts.map(t => (
        <ToastItem key={t.id} $type={t.type} $leaving={t.leaving}>
          <ProgressBar $type={t.type} $duration={4000} />
          <IconWrap $type={t.type}>{ICONS[t.type]}</IconWrap>
          <Body>
            {t.title && <Title $type={t.type}>{t.title}</Title>}
            {t.message && <Message $type={t.type}>{t.message}</Message>}
          </Body>
          <CloseBtn $type={t.type} onClick={() => onDismiss(t.id)}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </CloseBtn>
        </ToastItem>
      ))}
    </Wrapper>
  );
}
