// src/pages/config/components/EditorColumn.jsx
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  grid-area: editor;
  display: grid;
  gap: 12px;
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  background: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export default function EditorColumn({ cfg }) {
  return (
    <Box>
      <Card>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Editor placeholder ✅</div>
        <Input
          placeholder="Título"
          value={cfg.profile.title}
          onChange={(e) => cfg.setProfile((p) => ({ ...p, title: e.target.value }))}
        />
      </Card>
    </Box>
  );
}