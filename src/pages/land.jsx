// src/pages/LandingLinkeo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import imagenHome from "../assets/imagen_home.png";
import imgTarjeta from "../assets/img_tarjeta.png";

const Global = createGlobalStyle`
  :root{
    --primary-color: #474747;
    --primary-color-light: #fffcfa;
    --primary-color-dark: #db6e09;
    --text-dark: #18181b;
    --text-light: #6b7280;
    --white: #ffffff;
    --max-width: 1200px;
  }
  *,*::before,*::after{ box-sizing: border-box; }
  html, body { scroll-behavior: smooth; }
  body{ margin:0; font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans"; color: var(--text-dark); }
  img{ display:block; max-width:100%; }
  a{ text-decoration: none; }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: #ffffff;
  color: var(--text-dark);
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
`;

const NavInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: .85rem 1rem;
  display: flex;
  align-items: center;
  gap: .75rem;

  .nav-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  @media (min-width: 768px){
    padding: 1rem 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    .nav-right { margin-left: 0; }
  }
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-dark);
  flex-shrink: 0;
  letter-spacing: .5px;

  span{ color: var(--primary-color-dark); }
`;

const LoginBtn = styled.button`
  flex-shrink: 0;
  padding: .5rem 1.1rem;
  border: 2px solid var(--text-dark);
  border-radius: 999px;
  background: transparent;
  color: var(--text-dark);
  font-weight: 700;
  font-size: .9rem;
  cursor: pointer;
  transition: all .2s ease;

  &:hover{
    background: var(--text-dark);
    color: #fff;
  }
`;

const MenuBtn = styled.button`
  border: 0;
  background: transparent;
  color: var(--text-dark);
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px){
    display: none;
  }
`;

const Links = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  margin: 0;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
  transform: translateY(${p => (p.$open ? "0%" : "-120%")});
  opacity: ${p => (p.$open ? 1 : 0)};
  pointer-events: ${p => (p.$open ? "auto" : "none")};
  transition: transform .35s ease, opacity .25s ease;
  z-index: 999;

  a{
    color: var(--text-dark);
    font-weight: 700;
    font-size: 1rem;
  }

  a:hover{
    color: var(--primary-color-dark);
  }

  @media (min-width: 768px){
    position: static;
    transform: none;
    opacity: 1;
    pointer-events: auto;
    background: transparent;
    box-shadow: none;
    padding: 0;
    flex-direction: row;
    gap: 1.5rem;
    justify-self: center;
  }
`;
/* ── Buttons ── */
const Btn = styled.button`
  padding: .75rem 1.5rem; border: 0; border-radius: 10px;
  background: var(--primary-color); color: var(--white); cursor: pointer; font-weight: 600;
  transition: background .2s ease;
  display: inline-flex; align-items: center; gap: .5rem;
  &:hover{ background: var(--primary-color-dark); }
`;

/* ── Sections ── */
const Section = styled.section`
  max-width: var(--max-width); margin: 0 auto; padding: 5rem 1rem;
`;

const HeaderContainer = styled(Section)`
  display: grid; gap: 2rem; overflow: hidden;
  @media (min-width: 768px){
    grid-template-columns: 2fr 3fr; align-items: center;
  }
`;

const H1 = styled.h1`
  margin: 0 0 1rem; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.2;
  text-align: center; color: var(--text-dark);
  span{ color: var(--primary-color); }
  @media (min-width: 768px){ text-align: left; }
`;

const P = styled.p`
  color: var(--text-light); line-height: 1.75rem; margin: 0 0 2rem;
  text-align: center;
  @media (min-width: 768px){ text-align: left; }
`;

const Center = styled.div`
  text-align: center;
  @media (min-width: 768px){ text-align: left; }
`;

const Explore = styled(Section)`
  display: grid; gap: 2rem; overflow: hidden;
  @media (min-width: 768px){
    grid-template-columns: 1fr 1fr; align-items: center;
  }
`;

const H2 = styled.h2`
  margin: 0 0 1rem; font-size: clamp(1.8rem, 3vw, 2.5rem); line-height: 1.2; text-align: center;
  color: var(--text-dark);
  @media (min-width: 768px){ text-align: left; }
`;

const BannerGrid = styled(Section)`
  display: grid; gap: 1rem;
  @media (min-width: 540px){ grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 768px){ grid-template-columns: repeat(3, 1fr); }
`;

const BannerCard = styled.div`
  padding: 2rem; border-radius: 3rem; box-shadow: 5px 5px 20px rgba(0,0,0,.1);
  background: var(--white);
  transition: box-shadow .2s ease;
  &:hover{ box-shadow: 10px 10px 40px rgba(0,0,0,.12); }
  h4{ margin: .5rem 0; font-size: 1.4rem; color: var(--text-dark); }
  p{ margin: 0; color: var(--text-light); line-height: 1.75rem; }
`;

const BannerIcon = styled.span`
  display: inline-block; margin-bottom: 1rem; padding: 5px 11px;
  font-size: 2rem; color: var(--white); border-radius: 1rem; background: #000; box-shadow: 5px 5px 30px #595959;
`;

const Special = styled(Section)`text-align: center;`;

const SpecialGrid = styled.div`
  margin-top: 2.5rem; display: grid; gap: 1rem;
  @media (min-width: 540px){ grid-template-columns: repeat(2,1fr); }
  @media (min-width: 768px){ grid-template-columns: repeat(3,1fr); gap: 2rem; }
`;

const Card = styled.div`
  background: var(--white); text-align: center; padding: 2rem; border-radius: 3rem;
  transition: box-shadow .2s ease;
  &:hover{ box-shadow: 10px 10px 40px rgba(0,0,0,.1); }
  img{ max-width: 200px; margin: 0 auto 1rem; filter: drop-shadow(10px 10px 20px rgba(0,0,0,.3)); }
  h4{ margin:.25rem 0 .5rem; font-size: 1.4rem; color: var(--text-dark); }
  p{ color: var(--text-light); line-height: 1.75rem; margin: 0 0 .75rem; }
`;

const Ratings = styled.div`margin-bottom: 1rem; color: goldenrod; font-size: 1rem;`;

const PriceRow = styled.div`
  display: flex; gap: 10px; align-items: center; justify-content: center;
  .price{ font-size: 1.1rem; font-weight: 700; color: var(--text-dark); }
`;

const Footer = styled.footer`background: var(--primary-color-light);`;

const FooterInner = styled(Section)`
  display: grid; gap: 2rem;
  @media (min-width: 540px){ grid-template-columns: 3fr 2fr; }
  @media (min-width: 768px){ grid-template-columns: 2fr repeat(3,1fr); }
`;

const FooterCol = styled.div`
  h4{ margin: 0 0 1rem; font-weight: 700; color: var(--text-dark); }
  p{ color: var(--text-light); }
  ul{ list-style:none; padding:0; margin:0; display:grid; gap:.75rem; }
  a{ color: var(--text-light); }
  a:hover{ color: var(--primary-color); }
`;

const FooterBar = styled.div`padding: 1rem; text-align: center; color: var(--text-light);`;

const OldPrice = styled.span`
  font-size: .95rem;
  color: var(--text-light);
  text-decoration: line-through;
  margin-right: 4px;
`;

const LaunchBadge = styled.span`
  font-size: .68rem;
  background: #db6e09;
  color: #fff;
  border-radius: 999px;
  padding: 3px 10px;
  font-weight: 700;
  vertical-align: middle;
  display: inline-block;
  margin-bottom: 4px;
  white-space: nowrap;
`;
/* ═══════════════════════════════════════════════════ */
export default function LandingLinkeo(){
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Page>
      <Global />

 <Nav>
        <NavInner>
          {/* Logo — izquierda */}
          <Logo href="#home">LINKEO<span> </span></Logo>

          {/* Links — desktop center */}
          <Links $open={open} onClick={() => setOpen(false)}>
            <li><a href="#home">Inicio</a></li>
            <li><a href="#NFC">Tecnología NFC</a></li>
            <li><a href="#Tarjetas">Tarjetas</a></li>
          </Links>

          {/* Derecha: login + hamburguesa */}
          <div className="nav-right">
            <LoginBtn onClick={() => navigate("/login")}>Login</LoginBtn>
            <MenuBtn aria-label="Menú" onClick={() => setOpen(v => !v)}>
              {open ? "✕" : "☰"}
            </MenuBtn>
          </div>
        </NavInner>
      </Nav>

      {/* HERO */}
      <HeaderContainer id="home">
        <div><img src={imagenHome} alt="Tarjeta NFC Linkeo" /></div>
        <div>
          <H1>Conecta con <span>un solo toque</span>.</H1>
          <P>Con Linkeo, comparte tu perfil, redes sociales o negocio con una tarjeta NFC moderna y personal. Tu identidad digital, ahora al alcance de un tap.</P>
          <Center>
            <a href="https://wa.me/51937721429?text=Hola%2C%20deseo%20solicitar%20informaci%C3%B3n%20sobre%20las%20tarjetas%20NFC%20de%20Linkeo" target="_blank" rel="noreferrer">
              <Btn><i className="ri-whatsapp-line" /> Solicitar información</Btn>
            </a>
          </Center>
        </div>
      </HeaderContainer>

      {/* NFC */}
      <Explore id="NFC">
        <div><img src={imgTarjeta} alt="Tarjeta NFC Linkeo" /></div>
        <div>
          <H2>Tarjeta NFC Inteligente</H2>
          <P>Conecta tu mundo digital con un solo toque. Nuestra tarjeta NFC inteligente te permite compartir tu perfil, redes sociales, contacto, portafolio o cualquier enlace personalizado sin apps ni complicaciones. Compatible con todos los dispositivos modernos.</P>
          <Center>
            <a href="#Tarjetas"><Btn>Conoce Más <i className="ri-arrow-right-line" /></Btn></a>
          </Center>
        </div>
      </Explore>

      {/* BANNERS */}
      <BannerGrid>
        <BannerCard>
          <BannerIcon><i className="ri-link" /></BannerIcon>
          <h4>Activa tu Tarjeta</h4>
          <p>Solo acerca tu tarjeta NFC Linkeo a un smartphone y activa tu enlace personalizado. No necesitas apps ni escáneres QR.</p>
        </BannerCard>
        <BannerCard>
          <BannerIcon><i className="ri-profile-line" /></BannerIcon>
          <h4>Personaliza tu Perfil</h4>
          <p>Te ayudamos a crear tu perfil con redes, contacto, ubicación y más. Tú envías la info, nosotros lo diseñamos por ti.</p>
        </BannerCard>
        <BannerCard>
          <BannerIcon><i className="ri-share-line" /></BannerIcon>
          <h4>Comparte con un Toque</h4>
          <p>Conecta al instante con clientes y contactos tocando la tarjeta en un teléfono. Experiencia moderna y memorable.</p>
        </BannerCard>
      </BannerGrid>

      {/* CTA */}
      <Explore>
        <div>
          <H2>¿Listo para conectar de verdad?</H2>
          <P>El mundo se mueve con un solo toque. Haz que cada encuentro sea una oportunidad con <strong>Linkeo</strong>.<br/>Elige la tarjeta que mejor se adapte a ti y da el siguiente paso hacia tu identidad digital.</P>
          <Center>
            <a href="#Tarjetas"><Btn>Conoce Más <i className="ri-arrow-right-line" /></Btn></a>
          </Center>
        </div>
        <div><img src={imgTarjeta} alt="Tarjeta NFC Linkeo" /></div>
      </Explore>

  {/* TARJETAS */}
<Special id="Tarjetas">
  <H2>Nuestras Tarjetas NFC</H2>
  <P>
    Elige el tipo de tarjeta que se adapta a tu estilo y necesidad. Todas con tecnología NFC para compartir tu identidad digital con un solo toque.
  </P>

  <SpecialGrid>
    <Card>
      <img src={imgTarjeta} alt="Tarjeta Personal" />
      <h4>Plan 1 Enlace</h4>
      <p>
        Ideal si deseas enlazar tu tarjeta NFC a una sola red social o enlace principal, como WhatsApp, Instagram, TikTok, Facebook, tu web o portafolio. Incluye diseño genérico listo para usar.
      </p>
      <Ratings>
        <i className="ri-nfc-fill" /> 
        <i className="ri-user-fill" /> 
        <i className="ri-smartphone-line" />
      </Ratings>

      <PriceRow>
        <div>
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>S/ 79.90</OldPrice>
          <span className="price">S/ 59.90</span>
        </div>
        <a href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%201%20Enlace" target="_blank" rel="noreferrer">
          <Btn>Más info</Btn>
        </a>
      </PriceRow>
    </Card>

    <Card>
      <img src={imgTarjeta} alt="Tarjeta Empresarial" />
      <h4>Plan Personalizado</h4>
      <p>
        Perfecto si quieres enlazar tu tarjeta NFC a cualquier red social o enlace de tu preferencia. Incluye diseño personalizado a tu gusto, adaptado a tu marca, estilo o negocio.
      </p>
      <Ratings>
        <i className="ri-building-line" /> 
        <i className="ri-briefcase-line" /> 
        <i className="ri-share-line" />
      </Ratings>

      <PriceRow>
        <div>
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>S/ 99.90</OldPrice>
          <span className="price">S/ 79.90 (pago único)</span>
        </div>
        <a href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%20Personalizado" target="_blank" rel="noreferrer">
          <Btn>Más info</Btn>
        </a>
      </PriceRow>
    </Card>

    <Card>
      <img src={imgTarjeta} alt="Tarjeta Premium" />
      <h4>Plan con Sistema</h4>
      <p>
        Pensado para quienes desean una experiencia más completa. Creamos una interfaz personalizada donde podrás mostrar en una sola página todas tus redes sociales, enlaces, contacto, ubicación, catálogo o información de tu negocio.
      </p>
      <Ratings>
        <i className="ri-star-fill" /> 
        <i className="ri-bar-chart-box-line" /> 
        <i className="ri-global-line" />
      </Ratings>

      <PriceRow>
        <div>
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>Desde S/ 119.90 + S/ 10/mes</OldPrice>
          <span className="price">Desde S/ 99.90 + S/ 10/mes</span>
        </div>
        <a href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%20con%20Sistema" target="_blank" rel="noreferrer">
          <Btn>Más info</Btn>
        </a>
      </PriceRow>
    </Card>
  </SpecialGrid>
</Special>
      {/* FOOTER */}
      <Footer id="contact">
        <FooterInner>
          <FooterCol>
            <Logo href="#">Link<span>eo</span></Logo>
            <p>Revoluciona tu forma de conectar. Con Linkeo, comparte tu identidad digital con una tarjeta NFC moderna, elegante y sin complicaciones.</p>
          </FooterCol>
          <FooterCol>
            <h4>Productos</h4>
            <ul>
              <li><a href="#Tarjetas">Tarjetas NFC</a></li>
              <li><a href="#">Plan 1 Enlace</a></li>
              <li><a href="#">Plan Personalizado</a></li>
              <li><a href="#">Plan con Sistema</a></li>
            </ul>
          </FooterCol>
          <FooterCol>
            <h4>Enlaces Útiles</h4>
            <ul>
              <li><a href="#">¿Cómo funciona?</a></li>
              <li><a href="https://wa.me/51937721429" target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </FooterCol>
          <FooterCol>
            <h4>Compañía</h4>
            <ul>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </FooterCol>
        </FooterInner>
        <FooterBar>Copyright © {new Date().getFullYear()} Linkeo. Todos los derechos reservados.</FooterBar>
      </Footer>
    </Page>
  );
}
