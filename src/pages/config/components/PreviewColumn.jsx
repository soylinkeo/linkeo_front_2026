import React from "react";
import styled from "styled-components";

const PhoneCol = styled.div`
  grid-area: phone;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Phone = styled.div`
  width: min(420px, 100%);
  margin: 0 auto;
  border-radius: 28px;
  padding: 14px;
  background: #e5e7eb;
  border: 1px solid #d1d5db;
`;

const Preview = styled.div`
  border-radius: 22px;
  padding: 16px;
  background: #0b1220;
  color: ${(p) => p.$color || "#fff"};
`;

const SaveBtn = styled.button`
  width: min(420px, 100%);
  margin: 0 auto;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
`;

export default function PreviewColumn({ cfg }) {
  return (
    <PhoneCol>
      <Phone>
        <Preview $color={cfg?.profile?.textColor || "#fff"}>
          <div style={{ textAlign: "center", fontWeight: 800 }}>
            {cfg?.titleText || "Tu nombre o marca"}
          </div>
          <div style={{ textAlign: "center", opacity: 0.85 }}>
            {cfg?.descText || "Descripción…"}
          </div>
          <div style={{ marginTop: 12, opacity: 0.7, fontSize: 13 }}>
            Preview placeholder ✅
          </div>
        </Preview>
      </Phone>

      <SaveBtn onClick={cfg?.saveToBackend} disabled={cfg?.loadingNet}>
        {cfg?.loadingNet ? "Guardando..." : "Guardar Cambios"}
      </SaveBtn>
    </PhoneCol>
  );
}