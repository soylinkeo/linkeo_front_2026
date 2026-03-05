// src/pages/config/styles.js
import styled from "styled-components";

export const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  h1 {
    margin: 0;
    font-size: 22px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Grid = styled.div`
  display: grid;
  align-items: start;
  gap: 18px;
  grid-template-areas: "phone" "editor";
  grid-template-columns: 1fr;

  @media (min-width: 980px) {
    grid-template-areas: "editor phone";
    grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.8fr);
  }
`;