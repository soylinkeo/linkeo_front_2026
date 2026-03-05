// src/pages/config/components/PresetsBar.jsx
import React from "react";
import styled from "styled-components";

const PresetsBarWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-bottom: 6px;
`;

const Btn = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }
`;

const Swatch = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-block;
  background: ${(p) => p.$bg};
  border: 1px solid #e5e7eb;
`;

export default function PresetsBar({ presets, applyPreset, surprise }) {
  return (
    <PresetsBarWrap>
      <strong style={{ marginRight: 6 }}>Estilos rápidos:</strong>
      {presets.map((p) => (
        <Btn key={p.key} onClick={() => applyPreset(p.key)} title={p.name}>
          <Swatch $bg={p.demo} /> {p.name}
        </Btn>
      ))}
      <Btn onClick={surprise}>🎲 Sorpréndeme</Btn>
    </PresetsBarWrap>
  );
}