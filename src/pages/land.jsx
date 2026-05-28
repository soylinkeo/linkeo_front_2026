// src/pages/LandingLinkeo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import imagenHome from "../assets/imagen_home.png";
import imgTarjeta from "../assets/img_tarjeta.png";

const Global = createGlobalStyle`
  :root{
    --primary-color: #000000;
    --primary-color-light: #f7f7f7;
    --primary-color-dark: #111111;
    --text-dark: #0f0f0f;
    --text-light: #666666;
    --white: #ffffff;
    --soft-gray: #f3f3f3;
    --border-soft: rgba(0,0,0,.08);
    --max-width: 1200px;
  }

  *,*::before,*::after{
    box-sizing: border-box;
  }

  html, body{
    scroll-behavior: smooth;
  }

  body{
    margin: 0;
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans";
    color: var(--text-dark);
    background:
      radial-gradient(circle at top left, rgba(0,0,0,.06), transparent 28%),
      radial-gradient(circle at top right, rgba(0,0,0,.04), transparent 25%),
      #ffffff;
  }

  img{
    display: block;
    max-width: 100%;
  }

  a{
    text-decoration: none;
  }

  @keyframes floatSoft {
    0%, 100%{
      transform: translateY(0);
    }
    50%{
      transform: translateY(-12px);
    }
  }

  @keyframes fadeUp {
    from{
      opacity: 0;
      transform: translateY(18px);
    }
    to{
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: hidden;

  &::before{
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(0,0,0,.045);
    top: 140px;
    right: -120px;
    filter: blur(8px);
    z-index: -1;
  }

  &::after{
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(0,0,0,.04);
    top: 760px;
    left: -100px;
    filter: blur(8px);
    z-index: -1;
  }
`;

/* NAVBAR */
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(14px);
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

  .nav-right{
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  @media (min-width: 768px){
    padding: 1rem 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;

    .nav-right{
      margin-left: 0;
    }
  }
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 900;
  color: #000;
  flex-shrink: 0;
  letter-spacing: .5px;

  span{
    color: #555;
  }
`;

const LoginBtn = styled.button`
  flex-shrink: 0;
  padding: .5rem 1.1rem;
  border: 2px solid #000;
  border-radius: 999px;
  background: transparent;
  color: #000;
  font-weight: 700;
  font-size: .9rem;
  cursor: pointer;
  transition: all .2s ease;

  &:hover{
    background: #000;
    color: #fff;
  }
`;

const MenuBtn = styled.button`
  border: 0;
  background: transparent;
  color: #000;
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
    color: #000;
    font-weight: 700;
    font-size: 1rem;
  }

  a:hover{
    color: #666;
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

/* BOTONES */
const Btn = styled.button`
  padding: .78rem 1.55rem;
  border: 1px solid #000;
  border-radius: 999px;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  transition: all .25s ease;
  display: inline-flex;
  align-items: center;
  gap: .5rem;

  &:hover{
    background: #fff;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0,0,0,.16);
  }
`;

/* BASE */
const Section = styled.section`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 5rem 1rem;
`;

const H1 = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.2;
  text-align: center;
  color: #000;

  span{
    color: #444;
  }

  @media (min-width: 768px){
    text-align: left;
  }
`;

const H2 = styled.h2`
  margin: 0 0 1rem;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  line-height: 1.2;
  text-align: center;
  color: #000;

  span{
    color: #555;
  }

  @media (min-width: 768px){
    text-align: left;
  }
`;

const P = styled.p`
  color: var(--text-light);
  line-height: 1.75rem;
  margin: 0 0 2rem;
  text-align: center;

  @media (min-width: 768px){
    text-align: left;
  }
`;

const Center = styled.div`
  text-align: center;

  @media (min-width: 768px){
    text-align: left;
  }
`;

/* HERO */
const HeaderContainer = styled(Section)`
  display: grid;
  gap: 2rem;
  overflow: hidden;
  animation: fadeUp .7s ease both;

  @media (min-width: 768px){
    grid-template-columns: 2fr 3fr;
    align-items: center;
  }
`;

const HeroImageBox = styled.div`
  position: relative;
  animation: floatSoft 4s ease-in-out infinite;

  &::after{
    content: "NFC";
    position: absolute;
    right: 12%;
    bottom: 8%;
    background: #ffffff;
    color: #000;
    border: 1px solid rgba(0,0,0,.08);
    border-radius: 999px;
    padding: .45rem .85rem;
    font-weight: 800;
    font-size: .8rem;
    box-shadow: 0 12px 30px rgba(0,0,0,.14);
  }
`;

const HeroTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  padding: .45rem .85rem;
  margin-bottom: 1rem;
  border-radius: 999px;
  background: #f1f1f1;
  color: #000;
  border: 1px solid rgba(0,0,0,.08);
  font-weight: 800;
  font-size: .85rem;

  @media (max-width: 767px){
    margin-left: auto;
    margin-right: auto;
  }
`;

const TrustBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .7rem;
  margin-top: 1.4rem;
  justify-content: center;

  span{
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .5rem .8rem;
    border-radius: 999px;
    background: rgba(255,255,255,.85);
    border: 1px solid rgba(0,0,0,.08);
    color: #000;
    font-size: .85rem;
    font-weight: 700;
    box-shadow: 0 10px 25px rgba(0,0,0,.05);
  }

  @media (min-width: 768px){
    justify-content: flex-start;
  }
`;

const MiniStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .75rem;
  margin-top: 1.5rem;

  @media (max-width: 540px){
    grid-template-columns: 1fr;
  }
`;

const MiniStat = styled.div`
  padding: 1rem;
  border-radius: 1.4rem;
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
  text-align: center;

  strong{
    display: block;
    color: #000;
    font-size: 1.1rem;
  }

  span{
    color: var(--text-light);
    font-size: .82rem;
  }
`;

/* SECCIONES PRINCIPALES */
const Explore = styled(Section)`
  display: grid;
  gap: 2rem;
  overflow: hidden;

  @media (min-width: 768px){
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const BannerGrid = styled(Section)`
  display: grid;
  gap: 1rem;

  @media (min-width: 540px){
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BannerCard = styled.div`
  padding: 2rem;
  border-radius: 3rem;
  box-shadow: 5px 5px 20px rgba(0,0,0,.08);
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(0,0,0,.08);
  transition: all .25s ease;

  &:hover{
    transform: translateY(-6px);
    box-shadow: 10px 18px 45px rgba(0,0,0,.12);
  }

  h4{
    margin: .5rem 0;
    font-size: 1.4rem;
    color: #000;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.75rem;
  }
`;

const BannerIcon = styled.span`
  display: inline-block;
  margin-bottom: 1rem;
  padding: 7px 12px;
  font-size: 1.8rem;
  color: #fff;
  border-radius: 1rem;
  background: #000;
  box-shadow: 0 12px 28px rgba(0,0,0,.18);
`;

/* QUE PUEDES COMPARTIR */
const FeatureShowcase = styled(Section)`
  display: grid;
  gap: 2rem;
  align-items: center;

  @media (min-width: 900px){
    grid-template-columns: .9fr 1.1fr;
  }
`;

const FeatureIntro = styled.div`
  padding: 2rem;
  border-radius: 2rem;
  background: #000;
  color: #fff;
  box-shadow: 0 18px 45px rgba(0,0,0,.18);

  span{
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .45rem .8rem;
    border-radius: 999px;
    background: rgba(255,255,255,.12);
    color: #fff;
    font-size: .82rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h2{
    margin: 0 0 1rem;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    line-height: 1.2;
  }

  p{
    margin: 0;
    color: rgba(255,255,255,.72);
    line-height: 1.75rem;
  }
`;

const FeatureList = styled.div`
  display: grid;
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.3rem;
  border-radius: 1.5rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 30px rgba(0,0,0,.06);
  transition: all .25s ease;

  &:hover{
    transform: translateX(6px);
    box-shadow: 0 18px 38px rgba(0,0,0,.10);
  }

  .icon{
    width: 48px;
    height: 48px;
    border-radius: 1rem;
    background: #f1f1f1;
    color: #000;
    display: grid;
    place-items: center;
    font-size: 1.45rem;
    border: 1px solid rgba(0,0,0,.08);
  }

  h4{
    margin: 0 0 .35rem;
    color: #000;
    font-size: 1.2rem;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.65rem;
  }

  @media (max-width: 480px){
    grid-template-columns: 1fr;

    .icon{
      margin: 0 auto;
    }

    h4,
    p{
      text-align: center;
    }
  }
`;

/* SECCION NEGRA */
const DarkSection = styled(Section)`
  max-width: 100%;
  width: 100%;
  background: #000;
  color: #fff;
  padding: 5rem 1rem;
  margin: 0;

  .inner{
    max-width: var(--max-width);
    margin: 0 auto;
    display: grid;
    gap: 2rem;
    align-items: center;
  }

  h2{
    color: #fff;
    text-align: center;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    margin: 0 0 1rem;
  }

  p{
    color: rgba(255,255,255,.72);
    line-height: 1.8rem;
    max-width: 760px;
    margin: 0 auto 2rem;
    text-align: center;
  }
`;

const DarkGrid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DarkCard = styled.div`
  padding: 2rem;
  border-radius: 2rem;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  transition: all .25s ease;

  &:hover{
    transform: translateY(-6px);
    background: rgba(255,255,255,.10);
  }

  i{
    font-size: 2rem;
    margin-bottom: 1rem;
    display: inline-block;
  }

  h4{
    color: #fff;
    font-size: 1.25rem;
    margin: 0 0 .7rem;
  }

  p{
    margin: 0;
    color: rgba(255,255,255,.70);
    text-align: left;
  }

  @media (max-width: 767px){
    text-align: center;

    p{
      text-align: center;
    }
  }
`;

/* COMO FUNCIONA */
const ProcessSection = styled(Section)`
  text-align: center;

  ${H2}{
    text-align: center;
  }

  ${P}{
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`;

const ProcessGrid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  gap: 1.2rem;
  position: relative;

  @media (min-width: 900px){
    grid-template-columns: repeat(3, 1fr);

    &::before{
      content: "";
      position: absolute;
      top: 42px;
      left: 16%;
      right: 16%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #000, transparent);
      z-index: 0;
    }
  }
`;

const ProcessCard = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  border-radius: 2rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 35px rgba(0,0,0,.07);
  transition: all .25s ease;

  &:hover{
    transform: translateY(-7px);
    box-shadow: 0 20px 45px rgba(0,0,0,.12);
  }

  .step{
    width: 58px;
    height: 58px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 1.15rem;
    border: 6px solid #f3f3f3;
  }

  h4{
    margin: 0 0 .6rem;
    color: #000;
    font-size: 1.25rem;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.7rem;
  }
`;

const HighlightBox = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 2rem;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 20px 45px rgba(0,0,0,.18);

  p{
    margin: 0;
    color: rgba(255,255,255,.78);
    line-height: 1.6rem;
    text-align: left;
  }

  strong{
    color: #fff;
  }

  button{
    background: #fff;
    color: #000;
    border-color: #fff;
  }

  button:hover{
    background: #000;
    color: #fff;
    border-color: #fff;
  }

  @media (max-width: 767px){
    flex-direction: column;
    text-align: center;

    p{
      text-align: center;
    }
  }
`;

/* IDEAL PARA */
const AudienceSection = styled(Section)`
  background: #f4f4f4;
  max-width: 100%;
  padding: 5rem 1rem;

  .inner{
    max-width: var(--max-width);
    margin: 0 auto;
  }

  ${H2}{
    text-align: center;
  }

  ${P}{
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`;

const AudienceGrid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 900px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AudienceCard = styled.div`
  position: relative;
  overflow: hidden;
  padding: 2rem;
  min-height: 250px;
  border-radius: 2rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 14px 35px rgba(0,0,0,.07);
  transition: all .25s ease;

  &::after{
    content: "";
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: rgba(0,0,0,.05);
    right: -45px;
    bottom: -45px;
  }

  &:hover{
    transform: translateY(-7px);
    background: #000;
    color: #fff;
  }

  &:hover p,
  &:hover .tag{
    color: rgba(255,255,255,.72);
  }

  &:hover .icon{
    background: #fff;
    color: #000;
  }

  .icon{
    width: 54px;
    height: 54px;
    border-radius: 1.2rem;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 1.7rem;
    margin-bottom: 1rem;
    transition: all .25s ease;
  }

  .tag{
    display: block;
    margin-bottom: .8rem;
    color: #777;
    font-weight: 700;
    font-size: .82rem;
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  h4{
    margin: 0 0 .7rem;
    font-size: 1.35rem;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.7rem;
  }
`;

/* FAQ */
const StepSection = styled(Section)`
  text-align: center;

  ${H2}{
    text-align: center;
  }

  ${P}{
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`;

const StepGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled.div`
  position: relative;
  padding: 2rem;
  border-radius: 2rem;
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 15px 35px rgba(0,0,0,.07);
  transition: all .25s ease;
  animation: fadeUp .7s ease both;

  &:hover{
    transform: translateY(-6px);
    box-shadow: 0 20px 45px rgba(0,0,0,.10);
  }

  h4{
    margin: 0 0 .6rem;
    font-size: 1.25rem;
    color: #000;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.7rem;
  }
`;

/* TARJETAS */
const Special = styled(Section)`
  text-align: center;

  ${H2}{
    text-align: center;
  }

  ${P}{
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`;

const SpecialGrid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 540px){
    grid-template-columns: repeat(2,1fr);
  }

  @media (min-width: 768px){
    grid-template-columns: repeat(3,1fr);
    gap: 2rem;
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,.95);
  text-align: center;
  padding: 2rem;
  border-radius: 3rem;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 30px rgba(0,0,0,.06);
  transition: all .25s ease;

  &:hover{
    transform: translateY(-8px);
    box-shadow: 10px 22px 50px rgba(0,0,0,.12);
  }

  img{
    max-width: 200px;
    margin: 0 auto 1rem;
    filter: drop-shadow(10px 10px 20px rgba(0,0,0,.25));
    transition: transform .25s ease;
  }

  &:hover img{
    transform: rotate(-2deg) scale(1.04);
  }

  h4{
    margin:.25rem 0 .5rem;
    font-size: 1.4rem;
    color: #000;
  }

  p{
    color: var(--text-light);
    line-height: 1.75rem;
    margin: 0 0 .75rem;
  }
`;

const Ratings = styled.div`
  margin-bottom: 1rem;
  color: #000;
  font-size: 1rem;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

  .price{
    font-size: 1.1rem;
    font-weight: 800;
    color: #000;
  }

  @media (max-width: 420px){
    flex-direction: column;
  }
`;

const OldPrice = styled.span`
  font-size: .95rem;
  color: var(--text-light);
  text-decoration: line-through;
  margin-right: 4px;
`;

const LaunchBadge = styled.span`
  font-size: .68rem;
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
  vertical-align: middle;
  display: inline-block;
  margin-bottom: 4px;
  white-space: nowrap;
`;

/* FOOTER */
const Footer = styled.footer`
  background: #f7f7f7;
`;

const FooterInner = styled(Section)`
  display: grid;
  gap: 2rem;

  @media (min-width: 540px){
    grid-template-columns: 3fr 2fr;
  }

  @media (min-width: 768px){
    grid-template-columns: 2fr repeat(3,1fr);
  }
`;

const FooterCol = styled.div`
  h4{
    margin: 0 0 1rem;
    font-weight: 800;
    color: #000;
  }

  p{
    color: var(--text-light);
    line-height: 1.7rem;
  }

  ul{
    list-style:none;
    padding:0;
    margin:0;
    display:grid;
    gap:.75rem;
  }

  a{
    color: var(--text-light);
  }

  a:hover{
    color: #000;
  }
`;

const FooterBar = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--text-light);
`;

const FloatingWhatsApp = styled.a`
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  z-index: 1200;
  box-shadow: 0 12px 28px rgba(0,0,0,.22);
  transition: all .25s ease;
  border: 1px solid #fff;

  &:hover{
    background: #fff;
    color: #000;
    transform: translateY(-4px) scale(1.04);
  }
`;

const BenefitsOrbitSection = styled.section`
  padding: 5rem 1rem;
  background:
    linear-gradient(135deg, #f7f7f7 0%, #ffffff 45%, #eeeeee 100%);
`;

const BenefitsOrbitInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: 900px){
    grid-template-columns: 1fr 1fr;
  }
`;

const BenefitsOrbitText = styled.div`
  .eyebrow{
    display: inline-flex;
    align-items: center;
    gap: .45rem;
    padding: .45rem .85rem;
    border-radius: 999px;
    background: #000;
    color: #fff;
    font-size: .82rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  h2{
    margin: 0 0 1rem;
    font-size: clamp(2rem, 4vw, 3.1rem);
    line-height: 1.1;
    color: #000;
  }

  p{
    margin: 0 0 1.5rem;
    color: var(--text-light);
    line-height: 1.8rem;
  }
`;

const BenefitsPoints = styled.div`
  display: grid;
  gap: .8rem;
`;

const BenefitPoint = styled.div`
  display: flex;
  align-items: center;
  gap: .8rem;
  color: #000;
  font-weight: 700;

  span{
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
`;

const OrbitStage = styled.div`
  position: relative;
  min-height: 460px;
  display: grid;
  place-items: center;

  @media (max-width: 899px){
    min-height: auto;
    gap: 1rem;
  }
`;

const OrbitCircle = styled.div`
  position: absolute;
  width: 390px;
  height: 390px;
  border-radius: 50%;
  border: 1px dashed rgba(0,0,0,.18);

  &::before{
    content: "";
    position: absolute;
    inset: 38px;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,.08);
  }

  @media (max-width: 899px){
    display: none;
  }
`;

const NfcPreviewCard = styled.div`
  position: relative;
  z-index: 2;
  width: min(310px, 100%);
  padding: 1.2rem;
  border-radius: 2.2rem;
  background: #ffffff;
  color: #000;
  border: 1px solid rgba(0,0,0,.10);
  box-shadow: 0 28px 60px rgba(0,0,0,.18);
  overflow: hidden;

  &::before{
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(0,0,0,.04);
    right: -70px;
    top: -70px;
  }

  .image-frame{
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, #f7f7f7, #e9e9e9);
    border: 1px solid rgba(0,0,0,.08);
    border-radius: 1.6rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  img{
    max-width: 190px;
    margin: 0 auto;
    filter: drop-shadow(0 14px 22px rgba(0,0,0,.22));
  }

  h4{
    position: relative;
    z-index: 1;
    margin: 0 0 .35rem;
    font-size: 1.3rem;
    color: #000;
  }

  p{
    position: relative;
    z-index: 1;
    margin: 0;
    color: #666;
    line-height: 1.55rem;
    font-size: .92rem;
  }
`;
const OrbitChip = styled.div`
  position: absolute;
  z-index: 3;
  width: 150px;
  padding: .9rem;
  border-radius: 1.3rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 18px 40px rgba(0,0,0,.12);
  text-align: center;
  transition: all .25s ease;

  &:hover{
    transform: translateY(-6px);
    background: #000;
    color: #fff;
  }

  &:hover span{
    background: #fff;
    color: #000;
  }

  span{
    width: 40px;
    height: 40px;
    margin: 0 auto .6rem;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 1.25rem;
    transition: all .25s ease;
  }

  strong{
    display: block;
    font-size: .95rem;
    line-height: 1.25rem;
  }

  &.top{
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.left{
    left: 0;
    top: 52%;
    transform: translateY(-50%);
  }

  &.right{
    right: 0;
    top: 52%;
    transform: translateY(-50%);
  }

  &.bottom{
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 899px){
    position: static;
    width: 100%;
    max-width: 300px;

    &.top,
    &.left,
    &.right,
    &.bottom{
      transform: none;
    }
  }
`;

const PlanCard = styled.div`
  position: relative;
  background: #ffffff;
  color: #000;
  text-align: left;
  padding: 1.4rem;
  border-radius: 2rem;
  border: 1px solid ${p => (p.$featured ? "#000" : "rgba(0,0,0,.08)")};
  box-shadow: ${p =>
    p.$featured
      ? "0 18px 45px rgba(0,0,0,.14)"
      : "0 12px 30px rgba(0,0,0,.07)"};
  transition: all .25s ease;
  overflow: hidden;

  &:hover{
    transform: translateY(-6px);
    box-shadow: 0 22px 50px rgba(0,0,0,.12);
  }

  h4{
    margin: .8rem 0 .45rem;
    font-size: 1.35rem;
    color: #000;
  }

  p{
    color: var(--text-light);
    line-height: 1.55rem;
    margin: 0 0 1rem;
    font-size: .95rem;
  }
`;

const PlanImageBox = styled.div`
  background: #f3f3f3;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 1.5rem;
  padding: .9rem;
  margin-bottom: 1rem;

  img{
    max-width: 160px;
    margin: 0 auto;
    filter: drop-shadow(0 14px 20px rgba(0,0,0,.20));
    transition: transform .25s ease;
  }

  ${PlanCard}:hover & img{
    transform: rotate(-2deg) scale(1.04);
  }
`;

const PlanTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .8rem;
  margin-bottom: .7rem;
`;

const PlanType = styled.span`
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .38rem .7rem;
  border-radius: 999px;
  background: #f1f1f1;
  color: #000;
  font-size: .75rem;
  font-weight: 800;
`;

const PlanRecommended = styled.span`
  padding: .38rem .7rem;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-size: .7rem;
  font-weight: 800;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 1.2rem;
  display: grid;
  gap: .55rem;

  li{
    display: flex;
    align-items: center;
    gap: .5rem;
    color: #333;
    font-size: .9rem;
    line-height: 1.25rem;
  }

  i{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    font-size: .78rem;
    flex-shrink: 0;
  }
`;

const KeywordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  margin: .8rem 0 1rem;

  span{
    padding: .35rem .65rem;
    border-radius: 999px;
    background: #f3f3f3;
    color: #000;
    font-size: .75rem;
    font-weight: 700;
    border: 1px solid rgba(0,0,0,.06);
  }
`;

const PlanPriceBox = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;

  .price-area{
    line-height: 1.2;
  }

  .price{
    display: block;
    font-size: 1rem;
    font-weight: 800;
    color: #000;
    margin-top: .12rem;
  }

  a button{
    padding: .62rem 1rem;
    font-size: .85rem;
  }

  @media (max-width: 480px){
    flex-direction: column;
    align-items: stretch;

    a button{
      width: 100%;
      justify-content: center;
    }
  }
`;




const ServiceSection = styled.section`
  padding: 5rem 1rem;
  background: #f5f5f5;
`;

const ServiceInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
`;

const ServiceHeader = styled.div`
  max-width: 760px;
  margin: 0 auto 2.5rem;
  text-align: center;

  .tag{
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .45rem .8rem;
    border-radius: 999px;
    background: #000;
    color: #fff;
    font-size: .8rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  h2{
    margin: 0 0 1rem;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: #000;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.75rem;
  }
`;

const ServiceList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ServiceItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.4rem;
  border-radius: 1.6rem;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  box-shadow: 0 12px 28px rgba(0,0,0,.06);
  transition: all .25s ease;

  &:hover{
    transform: translateY(-5px);
    box-shadow: 0 18px 40px rgba(0,0,0,.10);
  }

  .number{
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: .9rem;
  }

  .icon{
    width: 54px;
    height: 54px;
    border-radius: 1.2rem;
    background: #f1f1f1;
    color: #000;
    display: grid;
    place-items: center;
    font-size: 1.6rem;
    border: 1px solid rgba(0,0,0,.08);
  }

  h4{
    margin: 0 0 .35rem;
    color: #000;
    font-size: 1.2rem;
  }

  p{
    margin: 0;
    color: var(--text-light);
    line-height: 1.65rem;
  }

  @media (max-width: 720px){
    grid-template-columns: 1fr;
    text-align: center;

    .number,
    .icon{
      margin: 0 auto;
    }
  }
`;

const FAQSection = styled.section`
  padding: 5rem 1rem;
  background: #fff;
`;

const FAQInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  .tag{
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .45rem .8rem;
    border-radius: 999px;
    background: #f1f1f1;
    color: #000;
    font-size: .8rem;
    font-weight: 800;
    border: 1px solid rgba(0,0,0,.08);
    margin-bottom: 1rem;
  }

  h2{
    margin: 0 0 1rem;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: #000;
  }

  p{
    max-width: 680px;
    margin: 0 auto;
    color: var(--text-light);
    line-height: 1.75rem;
  }
`;

const FAQList = styled.div`
  display: grid;
  gap: .9rem;
`;

const FAQItem = styled.details`
  border-radius: 1.4rem;
  background: #f7f7f7;
  border: 1px solid rgba(0,0,0,.08);
  overflow: hidden;
  transition: all .25s ease;

  &[open]{
    background: #000;
    color: #fff;
    box-shadow: 0 18px 42px rgba(0,0,0,.18);
  }

  summary{
    list-style: none;
    cursor: pointer;
    padding: 1.2rem 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-weight: 800;
    color: inherit;
  }

  summary::-webkit-details-marker{
    display: none;
  }

  summary span{
    display: flex;
    align-items: center;
    gap: .7rem;
  }

  summary i{
    font-size: 1.25rem;
  }

  .arrow{
    transition: transform .25s ease;
  }

  &[open] .arrow{
    transform: rotate(180deg);
  }

  p{
    margin: 0;
    padding: 0 1.4rem 1.3rem 3.4rem;
    color: ${p => p.$dark ? "rgba(255,255,255,.75)" : "var(--text-light)"};
    line-height: 1.7rem;
  }

  &[open] p{
    color: rgba(255,255,255,.75);
  }

  @media (max-width: 520px){
    p{
      padding: 0 1.2rem 1.2rem;
    }
  }
`;


export default function LandingLinkeo(){
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Page>
      <Global />

      <Nav>
        <NavInner>
          <Logo href="#home">LINK<span>EO</span></Logo>

          <Links $open={open} onClick={() => setOpen(false)}>
            <li><a href="#home">Inicio</a></li>
            <li><a href="#NFC">Tecnología NFC</a></li>
            <li><a href="#funciona">Cómo funciona</a></li>
            <li><a href="#Tarjetas">Tarjetas</a></li>
            <li><a href="#faq">FAQ</a></li>
          </Links>

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
        <HeroImageBox>
          <img src={imagenHome} alt="Tarjeta NFC Linkeo" />
        </HeroImageBox>

        <div>
          <HeroTag>
            <i className="ri-nfc-line" /> Tarjetas NFC personalizadas
          </HeroTag>

          <H1>Conecta con <span>un solo toque</span>.</H1>

          <P>
            Con Linkeo, comparte tu perfil, redes sociales, WhatsApp, web o negocio
            con una tarjeta NFC moderna y personal. Tu identidad digital, ahora al alcance de un tap.
          </P>

          <Center>
            <a
              href="https://wa.me/51937721429?text=Hola%2C%20deseo%20solicitar%20informaci%C3%B3n%20sobre%20las%20tarjetas%20NFC%20de%20Linkeo"
              target="_blank"
              rel="noreferrer"
            >
              <Btn><i className="ri-whatsapp-line" /> Solicitar información</Btn>
            </a>
          </Center>

          <TrustBar>
            <span><i className="ri-nfc-line" /> NFC</span>
            <span><i className="ri-qr-code-line" /> QR opcional</span>
            <span><i className="ri-smartphone-line" /> Sin apps</span>
            <span><i className="ri-edit-line" /> Personalizable</span>
          </TrustBar>

          <MiniStats>
            <MiniStat>
              <strong>Sin apps</strong>
              <span>Funciona al acercar la tarjeta</span>
            </MiniStat>

            <MiniStat>
              <strong>1 toque</strong>
              <span>Comparte tu información rápido</span>
            </MiniStat>

            <MiniStat>
              <strong>Personalizable</strong>
              <span>Diseño y enlaces a tu estilo</span>
            </MiniStat>
          </MiniStats>
        </div>
      </HeaderContainer>

      {/* NFC */}
      <Explore id="NFC">
        <div>
          <img src={imgTarjeta} alt="Tarjeta NFC Linkeo" />
        </div>

        <div>
          <H2>Tarjeta NFC <span>inteligente</span></H2>

          <P>
            Conecta tu mundo digital con un solo toque. Nuestra tarjeta NFC inteligente
            te permite compartir tu perfil, redes sociales, contacto, portafolio o cualquier enlace
            personalizado sin apps ni complicaciones.
          </P>

          <Center>
            <a href="#Tarjetas">
              <Btn>Conoce más <i className="ri-arrow-right-line" /></Btn>
            </a>
          </Center>
        </div>
      </Explore>

   {/* BENEFICIOS */}
<BenefitsOrbitSection>
  <BenefitsOrbitInner>
    <BenefitsOrbitText>
      <div className="eyebrow">
        <i className="ri-sparkling-line" /> Experiencia Linkeo
      </div>

      <h2>Una forma más moderna de presentarte.</h2>

      <p>
        Linkeo transforma una tarjeta física en una conexión digital inmediata.
        Ya no necesitas dictar tu número, buscar tu usuario o enviar enlaces largos:
        solo acercas la tarjeta y tu información aparece al instante.
      </p>

      <BenefitsPoints>
        <BenefitPoint>
          <span><i className="ri-check-line" /></span>
          Comparte tu información sin instalar aplicaciones.
        </BenefitPoint>

        <BenefitPoint>
          <span><i className="ri-check-line" /></span>
          Ideal para ventas, eventos, negocios y marca personal.
        </BenefitPoint>

        <BenefitPoint>
          <span><i className="ri-check-line" /></span>
          Diseño limpio, elegante y adaptado a tu estilo.
        </BenefitPoint>
      </BenefitsPoints>
    </BenefitsOrbitText>

    <OrbitStage>
      <OrbitCircle />

      <OrbitChip className="top">
        <span><i className="ri-nfc-line" /></span>
        <strong>Acerca la tarjeta</strong>
      </OrbitChip>

      <OrbitChip className="left">
        <span><i className="ri-smartphone-line" /></span>
        <strong>Se abre en el celular</strong>
      </OrbitChip>

    <NfcPreviewCard>
  <div className="image-frame">
    <img src={imgTarjeta} alt="Tarjeta NFC Linkeo" />
  </div>

  
</NfcPreviewCard>

      <OrbitChip className="right">
        <span><i className="ri-links-line" /></span>
        <strong>Muestra tus enlaces</strong>
      </OrbitChip>

      <OrbitChip className="bottom">
        <span><i className="ri-user-heart-line" /></span>
        <strong>Conecta con clientes</strong>
      </OrbitChip>
    </OrbitStage>
  </BenefitsOrbitInner>
</BenefitsOrbitSection>

      {/* QUE PUEDES COMPARTIR */}
      <FeatureShowcase>
        <FeatureIntro>
          <span><i className="ri-links-line" /> Perfil digital Linkeo</span>
          <h2>Todo lo importante de tu marca en un solo toque.</h2>
          <p>
            Con Linkeo puedes dirigir a tus clientes hacia tus canales principales:
            WhatsApp, redes sociales, página web, catálogo, portafolio o cualquier enlace importante.
            Una forma simple, moderna y profesional de presentarte.
          </p>
        </FeatureIntro>

        <FeatureList>
          <FeatureItem>
            <div className="icon"><i className="ri-whatsapp-line" /></div>
            <div>
              <h4>WhatsApp directo</h4>
              <p>
                Tus clientes podrán escribirte al instante para consultas, pedidos, reservas
                o información sobre tus servicios.
              </p>
            </div>
          </FeatureItem>

          <FeatureItem>
            <div className="icon"><i className="ri-instagram-line" /></div>
            <div>
              <h4>Redes sociales</h4>
              <p>
                Conecta Instagram, TikTok, Facebook, LinkedIn, YouTube u otras redes para
                que conozcan mejor tu marca.
              </p>
            </div>
          </FeatureItem>

          <FeatureItem>
            <div className="icon"><i className="ri-global-line" /></div>
            <div>
              <h4>Web, catálogo o portafolio</h4>
              <p>
                Enlaza tu página web, tienda online, menú digital, catálogo, ubicación,
                portafolio o presentación comercial.
              </p>
            </div>
          </FeatureItem>
        </FeatureList>
      </FeatureShowcase>

      {/* SECCION NEGRA */}
      <DarkSection>
        <div className="inner">
          <div>
            <h2>Una tarjeta. Muchas formas de conectar.</h2>
            <p>
              Linkeo no es solo una tarjeta NFC. Es una forma moderna de presentar tu marca,
              compartir tus redes y hacer que cada contacto se convierta en una oportunidad.
            </p>
          </div>

          <DarkGrid>
            <DarkCard>
              <i className="ri-flashlight-line" />
              <h4>Rápido</h4>
              <p>
                Comparte tu información en segundos, sin escribir números, usuarios o enlaces largos.
              </p>
            </DarkCard>

            <DarkCard>
              <i className="ri-vip-diamond-line" />
              <h4>Elegante</h4>
              <p>
                Una presentación moderna, limpia y profesional para tu marca personal o negocio.
              </p>
            </DarkCard>

            <DarkCard>
              <i className="ri-recycle-line" />
              <h4>Reutilizable</h4>
              <p>
                Deja de imprimir tarjetas tradicionales. Usa una tarjeta digital, práctica y actualizable.
              </p>
            </DarkCard>
          </DarkGrid>
        </div>
      </DarkSection>

      {/* COMO FUNCIONA */}
      <ProcessSection id="funciona">
        <H2>¿Cómo funciona Linkeo?</H2>

        <P>
          En pocos pasos tienes tu tarjeta lista para usar. Nosotros te ayudamos con la configuración
          y tú solo empiezas a compartir tu información.
        </P>

        <ProcessGrid>
          <ProcessCard>
            <div className="step">01</div>
            <h4>Elige tu plan</h4>
            <p>
              Selecciona si deseas un enlace simple, un diseño personalizado o una página completa
              para mostrar todas tus redes.
            </p>
          </ProcessCard>

          <ProcessCard>
            <div className="step">02</div>
            <h4>Envíanos tu información</h4>
            <p>
              Nos compartes tu logo, redes sociales, WhatsApp, colores, idea de diseño
              o el enlace que deseas grabar.
            </p>
          </ProcessCard>

          <ProcessCard>
            <div className="step">03</div>
            <h4>Comparte con un toque</h4>
            <p>
              Acerca tu tarjeta a un celular compatible y tu cliente verá tu perfil,
              enlace o página personalizada al instante.
            </p>
          </ProcessCard>
        </ProcessGrid>

        <HighlightBox>
          <p>
            <strong>Tu tarjeta queda lista para usar.</strong><br />
            Ideal para vender, presentarte, compartir redes, captar clientes y mostrar tu marca
            de una forma más profesional.
          </p>

          <a href="#Tarjetas">
            <Btn>Ver planes</Btn>
          </a>
        </HighlightBox>
      </ProcessSection>

      {/* CTA */}
      <Explore>
        <div>
          <H2>¿Listo para conectar de verdad?</H2>

          <P>
            El mundo se mueve con un solo toque. Haz que cada encuentro sea una oportunidad
            con <strong> Linkeo</strong>. Elige la tarjeta que mejor se adapte a ti y da el siguiente
            paso hacia tu identidad digital.
          </P>

          <Center>
            <a href="#Tarjetas">
              <Btn>Conoce más <i className="ri-arrow-right-line" /></Btn>
            </a>
          </Center>
        </div>

        <div>
          <img src={imgTarjeta} alt="Tarjeta NFC Linkeo" />
        </div>
      </Explore>

      {/* IDEAL PARA */}
      <AudienceSection>
        <div className="inner">
          <H2>Hecho para quienes quieren conectar mejor</H2>

          <P>
            Linkeo se adapta a diferentes formas de vender, presentarte y compartir tu información.
            Es útil para negocios, marcas personales, equipos comerciales y profesionales independientes.
          </P>

          <AudienceGrid>
            <AudienceCard>
              <div className="icon"><i className="ri-store-2-line" /></div>
              <span className="tag">Negocios y ventas</span>
              <h4>Emprendedores</h4>
              <p>
                Comparte tu catálogo, WhatsApp, redes sociales, tienda online o menú digital
                sin depender de tarjetas de papel.
              </p>
            </AudienceCard>

            <AudienceCard>
              <div className="icon"><i className="ri-user-star-line" /></div>
              <span className="tag">Marca personal</span>
              <h4>Profesionales</h4>
              <p>
                Muestra tu contacto, portafolio, servicios, experiencia o redes en una presentación
                limpia y moderna.
              </p>
            </AudienceCard>

            <AudienceCard>
              <div className="icon"><i className="ri-team-line" /></div>
              <span className="tag">Equipos comerciales</span>
              <h4>Empresas</h4>
              <p>
                Una opción elegante para vendedores, asesores, ejecutivos, inmobiliarias,
                salones, clínicas, restaurantes y marcas.
              </p>
            </AudienceCard>
          </AudienceGrid>
        </div>
      </AudienceSection>

{/* TARJETAS */}
<Special id="Tarjetas">
  <H2>Nuestras Tarjetas NFC</H2>

  <P>
    Elige el plan que mejor se adapte a ti. Todas las tarjetas están pensadas para compartir tu información de forma rápida, moderna y profesional.
  </P>

  <SpecialGrid>
    <PlanCard>
      <PlanTop>
        <PlanType>
          <i className="ri-link" /> Básico
        </PlanType>
      </PlanTop>

      <PlanImageBox>
        <img src={imgTarjeta} alt="Tarjeta Personal" />
      </PlanImageBox>

      <h4>Plan 1 Enlace</h4>

      <p>
        Para quienes necesitan compartir un solo enlace principal de forma rápida y sencilla.
      </p>

      <KeywordRow>
        <span>1 enlace</span>
        <span>Diseño genérico</span>
        <span>NFC activo</span>
      </KeywordRow>

      <PlanFeatures>
        <li><i className="ri-check-line" /> WhatsApp, Instagram, TikTok, web o portafolio.</li>
        <li><i className="ri-check-line" /> Tarjeta lista para usar.</li>
        <li><i className="ri-check-line" /> Ideal para uso personal o contacto rápido.</li>
      </PlanFeatures>

      <PlanPriceBox>
        <div className="price-area">
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>S/ 79.90</OldPrice>
          <span className="price">S/ 59.90</span>
        </div>

        <a
          href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%201%20Enlace"
          target="_blank"
          rel="noreferrer"
        >
          <Btn>Más info</Btn>
        </a>
      </PlanPriceBox>
    </PlanCard>

    <PlanCard $featured>
      <PlanTop>
        <PlanType>
          <i className="ri-palette-line" /> Personalizado
        </PlanType>

        <PlanRecommended>Más elegido</PlanRecommended>
      </PlanTop>

      <PlanImageBox>
        <img src={imgTarjeta} alt="Tarjeta Empresarial" />
      </PlanImageBox>

      <h4>Plan Personalizado</h4>

      <p>
        Para quienes quieren una tarjeta con diseño propio y enlace directo a su red o página favorita.
      </p>

      <KeywordRow>
        <span>Diseño a gusto</span>
        <span>Logo o marca</span>
        <span>Pago único</span>
      </KeywordRow>

      <PlanFeatures>
        <li><i className="ri-check-line" /> Enlace a cualquier red social o página web.</li>
        <li><i className="ri-check-line" /> Diseño personalizado con tu estilo.</li>
        <li><i className="ri-check-line" /> Ideal para marcas, negocios y emprendedores.</li>
      </PlanFeatures>

      <PlanPriceBox>
        <div className="price-area">
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>S/ 99.90</OldPrice>
          <span className="price">S/ 79.90</span>
        </div>

        <a
          href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%20Personalizado"
          target="_blank"
          rel="noreferrer"
        >
          <Btn>Más info</Btn>
        </a>
      </PlanPriceBox>
    </PlanCard>

    <PlanCard>
      <PlanTop>
        <PlanType>
          <i className="ri-global-line" /> Completo
        </PlanType>
      </PlanTop>

      <PlanImageBox>
        <img src={imgTarjeta} alt="Tarjeta Premium" />
      </PlanImageBox>

      <h4>Plan con Sistema</h4>

      <p>
        Para quienes desean mostrar todas sus redes, datos y enlaces en una sola página personalizada.
      </p>

      <KeywordRow>
        <span>Multi enlaces</span>
        <span>Página propia</span>
        <span>Editable</span>
      </KeywordRow>

      <PlanFeatures>
        <li><i className="ri-check-line" /> Página con redes, WhatsApp, web y catálogo.</li>
        <li><i className="ri-check-line" /> Ideal para negocios y profesionales.</li>
        <li><i className="ri-check-line" /> Actualización de enlaces mientras esté activo.</li>
      </PlanFeatures>

      <PlanPriceBox>
        <div className="price-area">
          <LaunchBadge>Descuentos todo mayo</LaunchBadge><br />
          <OldPrice>Desde S/ 119.90 + S/ 10/mes</OldPrice>
          <span className="price">Desde S/ 99.90 + S/ 10/mes</span>
        </div>

        <a
          href="https://wa.me/51937721429?text=Hola%2C%20quiero%20el%20Plan%20con%20Sistema"
          target="_blank"
          rel="noreferrer"
        >
          <Btn>Más info</Btn>
        </a>
      </PlanPriceBox>
    </PlanCard>
  </SpecialGrid>
</Special>

    {/* BENEFICIOS EXTRA */}
<ServiceSection>
  <ServiceInner>
    <ServiceHeader>
      <div className="tag">
        <i className="ri-service-line" /> Beneficios Linkeo
      </div>

      <h2>Más que una tarjeta, una experiencia lista para usar</h2>

      <p>
        Te acompañamos desde la configuración hasta la entrega para que tu tarjeta NFC quede funcional, clara y alineada a tu marca.
      </p>
    </ServiceHeader>

    <ServiceList>
      <ServiceItem>
        <div className="number">01</div>

        <div>
          <h4>Menos papel, más impacto</h4>
          <p>
            Reemplaza las tarjetas tradicionales por una opción moderna, reutilizable y fácil de compartir en cualquier momento.
          </p>
        </div>

        <div className="icon">
          <i className="ri-leaf-line" />
        </div>
      </ServiceItem>

      <ServiceItem>
        <div className="number">02</div>

        <div>
          <h4>Preparación rápida y ordenada</h4>
          <p>
            Configuramos tu enlace, diseño o perfil digital según el plan elegido para que recibas tu tarjeta lista para usar.
          </p>
        </div>

        <div className="icon">
          <i className="ri-time-line" />
        </div>
      </ServiceItem>

      <ServiceItem>
        <div className="number">03</div>

        <div>
          <h4>Soporte personalizado</h4>
          <p>
            Te ayudamos con tus redes, WhatsApp, catálogo, web o perfil digital para que la experiencia final se vea profesional.
          </p>
        </div>

        <div className="icon">
          <i className="ri-customer-service-2-line" />
        </div>
      </ServiceItem>
    </ServiceList>
  </ServiceInner>
</ServiceSection>

{/* FAQ */}
<FAQSection id="faq">
  <FAQInner>
    <FAQHeader>
      <div className="tag">
        <i className="ri-question-line" /> Preguntas frecuentes
      </div>

      <h2>Dudas antes de pedir tu Linkeo</h2>

      <p>
        Respuestas rápidas para que sepas cómo funciona la tarjeta, qué incluye cada plan y cómo se configura.
      </p>
    </FAQHeader>

    <FAQList>
      <FAQItem open>
        <summary>
          <span>
            <i className="ri-smartphone-line" />
            ¿Necesito instalar una app?
          </span>
          <i className="ri-arrow-down-s-line arrow" />
        </summary>
        <p>
          No. La persona solo acerca el celular a la tarjeta NFC o abre el enlace configurado. También se puede usar un QR si lo agregas al diseño.
        </p>
      </FAQItem>

      <FAQItem>
        <summary>
          <span>
            <i className="ri-palette-line" />
            ¿Puedo elegir mi diseño?
          </span>
          <i className="ri-arrow-down-s-line arrow" />
        </summary>
        <p>
          Sí. En el plan personalizado puedes enviar tu logo, colores, nombre, marca o una referencia visual para preparar un diseño a tu gusto.
        </p>
      </FAQItem>

      <FAQItem>
        <summary>
          <span>
            <i className="ri-refresh-line" />
            ¿Puedo cambiar mi enlace después?
          </span>
          <i className="ri-arrow-down-s-line arrow" />
        </summary>
        <p>
          Depende del plan. En el plan con sistema puedes actualizar tus enlaces desde una misma página mientras el servicio esté activo.
        </p>
      </FAQItem>

      <FAQItem>
        <summary>
          <span>
            <i className="ri-links-line" />
            ¿Qué puedo colocar en mi tarjeta?
          </span>
          <i className="ri-arrow-down-s-line arrow" />
        </summary>
        <p>
          Puedes colocar WhatsApp, Instagram, TikTok, Facebook, LinkedIn, página web, catálogo, portafolio, ubicación o una página con todos tus enlaces.
        </p>
      </FAQItem>
    </FAQList>
  </FAQInner>
</FAQSection>

      {/* FOOTER */}
      <Footer id="contact">
        <FooterInner>
          <FooterCol>
            <Logo href="#">Link<span>eo</span></Logo>
            <p>
              Revoluciona tu forma de conectar. Con Linkeo, comparte tu identidad digital
              con una tarjeta NFC moderna, elegante y sin complicaciones.
            </p>
          </FooterCol>

          <FooterCol>
            <h4>Productos</h4>
            <ul>
              <li><a href="#Tarjetas">Tarjetas NFC</a></li>
              <li><a href="#Tarjetas">Plan 1 Enlace</a></li>
              <li><a href="#Tarjetas">Plan Personalizado</a></li>
              <li><a href="#Tarjetas">Plan con Sistema</a></li>
            </ul>
          </FooterCol>

          <FooterCol>
            <h4>Enlaces útiles</h4>
            <ul>
              <li><a href="#funciona">¿Cómo funciona?</a></li>
              <li><a href="#faq">Preguntas frecuentes</a></li>
              <li>
                <a
                  href="https://wa.me/51937721429"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </FooterCol>

          <FooterCol>
            <h4>Compañía</h4>
            <ul>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
          </FooterCol>
        </FooterInner>

        <FooterBar>
          Copyright © {new Date().getFullYear()} Linkeo. Todos los derechos reservados.
        </FooterBar>
      </Footer>

     <FloatingWhatsApp
  href="https://wa.me/51937721429?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20tarjetas%20NFC%20Linkeo"
  target="_blank"
  rel="noreferrer"
  aria-label="Contactar por WhatsApp"
>
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.5 11.7C20.5 16.45 16.62 20.3 11.85 20.3C10.35 20.3 8.95 19.92 7.73 19.25L3.5 20.5L4.77 16.43C3.98 15.08 3.55 13.48 3.55 11.7C3.55 6.95 7.38 3.1 12.15 3.1C16.92 3.1 20.5 6.95 20.5 11.7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.25 8.35C9.45 7.9 9.7 7.9 10.02 7.9H10.55C10.78 7.9 11.05 7.96 11.22 8.35L11.75 9.6C11.88 9.9 11.82 10.12 11.62 10.35L11.2 10.83C11.1 10.95 11.05 11.12 11.15 11.28C11.52 11.92 12.1 12.48 12.7 12.85C12.88 12.97 13.05 12.92 13.18 12.8L13.72 12.28C13.95 12.05 14.2 12 14.5 12.13L15.75 12.68C16.12 12.85 16.22 13.08 16.12 13.45C15.95 14.05 15.38 14.72 14.6 14.88C13.6 15.1 12.18 14.72 10.82 13.35C9.45 11.98 8.95 10.65 9.12 9.52C9.17 9.1 9.1 8.7 9.25 8.35Z"
      fill="currentColor"
    />
  </svg>
</FloatingWhatsApp>
    </Page>
  );
}