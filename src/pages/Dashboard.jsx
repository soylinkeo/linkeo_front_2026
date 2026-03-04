// src/pages/Dashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useAuth } from "../context/AuthContext";

/**
 * Paleta sobria (inspiración Pantone / editorial):
 * - Negro profundo (tipo Pantone Black C): #0B0B0C
 * - Blanco: #FFFFFF
 * - Gris frío (tipo Cool Gray): #9CA3AF / #6B7280
 * - Superficies: #F7F7F8 / #EFEFF1
 * - Borde: #E5E7EB
 */
const Global = createGlobalStyle`
  :root{
    --bg: #ffffff;
    --bg-soft: #f7f7f8;
    --ink: #0b0b0c;
    --muted: #6b7280;
    --muted-2: #9ca3af;
    --border: #e5e7eb;
    --card: #ffffff;
    --shadow: 0 18px 50px rgba(10, 10, 10, .08);

    --radius-xl: 28px;
    --radius-lg: 18px;

    --max: 1120px;

    --focus: rgba(17, 24, 39, .22);
  }

  *{ box-sizing: border-box; }
  html, body { scroll-behavior: smooth; }
  body{
    margin:0;
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans";
    color: var(--ink);
    background: var(--bg);
  }
  a{ text-decoration:none; color: inherit; }
  img{ max-width:100%; display:block; }
  button{ font-family: inherit; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100dvh;
  background:
    radial-gradient(900px 500px at 15% -10%, rgba(0,0,0,.06) 0%, transparent 55%),
    radial-gradient(700px 450px at 90% 0%, rgba(0,0,0,.05) 0%, transparent 50%),
    var(--bg);
`;

const Shell = styled.div`
  max-width: var(--max);
  margin: 0 auto;
  padding: 18px 16px 42px;
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,.06);
`;

const NavInner = styled.div`
  max-width: var(--max);
  margin: 0 auto;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  @media (min-width: 860px){
    grid-template-columns: auto 1fr auto;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: .2px;
  color: var(--ink);
  font-size: 16px;

  .dot{
    width: 10px; height: 10px; border-radius: 999px;
    background: var(--ink);
  }
  span{
    color: var(--muted);
    font-weight: 700;
    letter-spacing: .1px;
  }
`;

const NavCenter = styled.div`
  display: none;
  justify-self: center;
  gap: 10px;

  @media (min-width: 860px){
    display: flex;
  }
`;

const PillLink = styled(Link)`
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--ink);
  background: var(--bg);
  font-size: 13px;
  font-weight: 700;
  transition: transform .06s ease, background .15s ease, border-color .15s ease;

  &:hover{
    background: var(--bg-soft);
    border-color: rgba(0,0,0,.14);
  }
  &:active{ transform: translateY(1px); }
  &:focus-visible{ outline: 3px solid var(--focus); outline-offset: 2px; }
`;

const NavRight = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-self: end;
  flex-wrap: wrap;
`;

const UserBadge = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--muted);
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  b{ color: var(--ink); }
`;

const Btn = styled.button`
  border: 1px solid var(--border);
  background: var(--ink);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform .06s ease, background .15s ease, box-shadow .15s ease;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover{ background: #161617; box-shadow: 0 10px 24px rgba(0,0,0,.12); }
  &:active{ transform: translateY(1px); }
  &:focus-visible{ outline: 3px solid var(--focus); outline-offset: 2px; }

  &.ghost{
    background: var(--bg);
    color: var(--ink);
  }
  &.ghost:hover{
    background: var(--bg-soft);
    box-shadow: none;
  }
`;

const Main = styled.main`
  animation: ${fadeUp} .35s ease-out both;
`;

const Hero = styled.section`
  padding: 26px 0 14px;
  display: grid;
  gap: 18px;

  @media (min-width: 900px){
    grid-template-columns: 1.2fr .8fr;
    align-items: center;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(26px, 3.4vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.6px;

  span{
    color: var(--muted);
    font-weight: 800;
  }
`;

const HeroText = styled.p`
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
  max-width: 58ch;
`;

const HeroPanel = styled.div`
  border: 1px solid var(--border);
  background: linear-gradient(180deg, #fff 0%, var(--bg-soft) 100%);
  border-radius: var(--radius-xl);
  padding: 16px;
  box-shadow: var(--shadow);

  .kpi{
    display: grid;
    gap: 10px;
  }

  .row{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(255,255,255,.75);
    border: 1px solid rgba(0,0,0,.06);
  }

  .label{
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
  }

  .value{
    font-weight: 900;
    font-size: 13px;
  }
`;

const Actions = styled.section`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 14px;

  @media (max-width: 780px){
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(Link)`
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: var(--radius-xl);
  padding: 16px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 14px;
  box-shadow: var(--shadow);

  transition: transform .08s ease, box-shadow .2s ease, border-color .2s ease;

  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 26px 60px rgba(0,0,0,.10);
    border-color: rgba(0,0,0,.14);
  }
  &:focus-visible{ outline: 3px solid var(--focus); outline-offset: 3px; }

  h3{
    margin: 2px 0 6px;
    font-size: 15px;
    letter-spacing: -0.2px;
  }
  p{
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.5;
  }
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;

  border: 1px solid rgba(0,0,0,.08);
  background: #0b0b0c;
  color: #fff;

  svg{ display:block; }
`;

const Footer = styled.footer`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(0,0,0,.06);
  color: var(--muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;

  .mini{
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .dot{
    width: 6px; height: 6px; border-radius: 999px;
    background: rgba(0,0,0,.25);
  }
`;

const CogIcon = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M19 12a7 7 0 0 0-.1-1l2.2-1.7-2-3.5-2.6 1A7 7 0 0 0 14 5l-.4-2.7h-3.2L10 5a7 7 0 0 0-2.5 1l-2.6-1-2 3.5L5 11a7 7 0 0 0 0 2l-2.2 1.7 2 3.5 2.6-1A7 7 0 0 0 10 19l.4 2.7h3.2L14 19a7 7 0 0 0 2.5-1l2.6 1 2-3.5L19 13c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const CardIcon = (p) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 14h6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const name = user?.username || user?.email || "usuario";

  const handleLogout = async () => {
    await logout();
    nav("/login", { replace: true });
  };

  return (
    <Page>
      <Global />

      <Nav>
        <NavInner>
          <Brand to="/dashboard" aria-label="Ir al dashboard">
            <span className="dot" />
            LINKEO <span>Dashboard</span>
          </Brand>

          <NavCenter>
            <PillLink to="/config">Configurar enlaces</PillLink>
            <PillLink to="/designCard">Diseñar tarjeta</PillLink>
          </NavCenter>

          <NavRight>
            <UserBadge title={name}>
              Hola, <b>{name}</b>
            </UserBadge>

   
            <Btn onClick={handleLogout}>
              Cerrar sesión
            </Btn>
          </NavRight>
        </NavInner>
      </Nav>

      <Shell>
        <Main>
          <Hero>
            <div>
              <HeroTitle>
                Gestiona tu <span>identidad digital</span> en un solo lugar.
              </HeroTitle>
              <HeroText>
                Ajusta tus enlaces, redes y botones; luego diseña tu tarjeta “Link-in-bio” para que tu NFC
                comparta exactamente lo que quieres, con un estilo limpio y profesional.
              </HeroText>

          
            </div>

            <HeroPanel aria-label="Resumen rápido">
              <div className="kpi">
                <div className="row">
                  <div className="label">Estado</div>
                  <div className="value">Activo</div>
                </div>
                <div className="row">
                  <div className="label">Perfil</div>
                  <div className="value">Listo para compartir</div>
                </div>
                <div className="row">
                  <div className="label">Tip</div>
                  <div className="value">Diseña primero tu tarjeta</div>
                </div>
              </div>
            </HeroPanel>
          </Hero>

          <Actions>
            <ActionCard to="/config" aria-label="Ir a Configurar enlaces">
              <Icon><CogIcon /></Icon>
              <div>
                <h3>Configurar enlaces</h3>
                <p>Agrega tus redes, links, WhatsApp y ordena lo que se mostrará cuando toquen tu NFC.</p>
              </div>
            </ActionCard>

            <ActionCard to="/designCard" aria-label="Ir a Diseñar tarjeta">
              <Icon><CardIcon /></Icon>
              <div>
                <h3>Diseñar tarjeta</h3>
                <p>Define fondo, tipografía y botones. Previsualiza tu página tipo “link-in-bio”.</p>
              </div>
            </ActionCard>
          </Actions>

          <Footer>
            <div className="mini">
              <span className="dot" />
              <span>Linkeo • UI sobria blanco/negro</span>
            </div>
            <div>© {new Date().getFullYear()} Linkeo</div>
          </Footer>
        </Main>
      </Shell>
    </Page>
  );
}