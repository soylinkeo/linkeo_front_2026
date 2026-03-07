// src/pages/Step2.jsx
import React, { useMemo, useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    margin: 0; padding: 0;
    min-height: 100%;
    background: #0a0a0a;
  }
`;

/* ── Animations ── */
const floatIn = keyframes`
  from { transform: translateY(24px) scale(.97); opacity: 0; }
  to   { transform: translateY(0)    scale(1);   opacity: 1; }
`;
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;
const rotateBg = keyframes`
  0%   { transform: rotate(0deg)   scale(1.4); }
  50%  { transform: rotate(180deg) scale(1.6); }
  100% { transform: rotate(360deg) scale(1.4); }
`;
const pulse = keyframes`
  0%, 100% { opacity: .15; }
  50%       { opacity: .28; }
`;

/* ── Page ── */
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #0a0a0a;
  font-family: "Poppins", system-ui, sans-serif;
  position: relative;
  overflow: hidden;

  /* orb top-left */
  &::before {
    content: "";
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    top: -200px; left: -180px;
    background: radial-gradient(circle, rgba(255,255,255,.22) 0%, rgba(255,255,255,.06) 45%, transparent 70%);
    animation: ${rotateBg} 18s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* orb bottom-right */
  &::after {
    content: "";
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    bottom: -160px; right: -140px;
    background: radial-gradient(circle, rgba(255,255,255,.16) 0%, rgba(255,255,255,.04) 45%, transparent 70%);
    animation: ${rotateBg} 22s linear infinite reverse;
    pointer-events: none;
    z-index: 0;
  }
`;

/* grid lines */
const Grid = styled.div`
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
  animation: ${pulse} 6s ease-in-out infinite;
`;

/* white glow center-top */
const TopGlow = styled.div`
  position: fixed;
  width: 700px; height: 260px;
  top: -60px; left: 50%;
  translate: -50% 0;
  background: radial-gradient(ellipse, rgba(255,255,255,.14) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
`;

/* white glow center-bottom */
const BottomGlow = styled.div`
  position: fixed;
  width: 700px; height: 260px;
  bottom: -60px; left: 50%;
  translate: -50% 0;
  background: radial-gradient(ellipse, rgba(255,255,255,.10) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
`;

/* ── Card ── */
const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  background: linear-gradient(145deg, #1c1c1c 0%, #0f0f0f 50%, #1a1a1a 100%);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 28px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.04),
    0 40px 80px rgba(0,0,0,.9),
    inset 0 1px 0 rgba(255,255,255,.10);
  padding: 44px 32px 36px;
  animation: ${floatIn} .5s cubic-bezier(.22,1,.36,1) both;

  /* top shine line */
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
    border-radius: 999px;
  }
`;

/* ── Brand ── */
const Brand = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoText = styled.div`
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: transparent;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 50%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
  margin-bottom: 6px;
`;

const TagLine = styled.p`
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,.45);
  letter-spacing: .3px;
`;

const DividerLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 0;

  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
  }

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(255,255,255,.28);
    text-transform: uppercase;
  }
`;

/* ── Form ── */
const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Field = styled.label`
  display: grid;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,.55);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const InputWrap = styled.div`
  position: relative;
  display: grid;
`;

const Input = styled.input`
  height: 50px;
  padding: 10px 44px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  width: 100%;
  transition: border-color .2s, box-shadow .2s, background .2s;

  &::placeholder { color: rgba(255,255,255,.22); }
  &:hover  {
    border-color: rgba(255,255,255,.22);
    background: rgba(255,255,255,.08);
  }
  &:focus  {
    border-color: rgba(255,255,255,.50);
    background: rgba(255,255,255,.10);
    box-shadow: 0 0 0 3px rgba(255,255,255,.07), 0 0 24px rgba(255,255,255,.05);
  }
  &[aria-invalid="true"] {
    border-color: rgba(239,68,68,.65);
    box-shadow: 0 0 0 3px rgba(239,68,68,.12);
  }
`;

const LeftIcon = styled.span`
  position: absolute;
  inset: 0 auto 0 14px;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: rgba(255,255,255,.3);
`;

const RightBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  translate: 0 -50%;
  border: 0;
  background: transparent;
  padding: 7px 10px;
  border-radius: 10px;
  color: rgba(255,255,255,.3);
  cursor: pointer;
  transition: color .2s, background .2s;
  &:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.7); }
`;

const ErrorText = styled.div`
  color: #f87171;
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
`;

const Check = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255,255,255,.5);
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #fff;
    cursor: pointer;
  }
`;

/* ── Buttons ── */
const Submit = styled.button`
  height: 50px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%);
  color: #000;
  font-weight: 800;
  font-size: 14px;
  font-family: inherit;
  letter-spacing: .5px;
  cursor: pointer;
  transition: box-shadow .2s, transform .05s, filter .2s;
  box-shadow: 0 8px 28px rgba(255,255,255,.15), 0 2px 8px rgba(0,0,0,.4);
  margin-top: 6px;
  position: relative;
  overflow: hidden;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,.3) 60%, transparent 70%);
    background-size: 200% auto;
    animation: ${shimmer} 2.5s linear infinite;
    border-radius: inherit;
  }

  &:hover   { filter: brightness(1.08); box-shadow: 0 12px 36px rgba(255,255,255,.2); }
  &:active  { transform: translateY(1px); }
  &:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; filter: none; }
`;

const Secondary = styled.button`
  height: 50px;
  width: 100%;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  color: rgba(255,255,255,.75);
  font-weight: 700;
  font-size: 14px;
  font-family: inherit;
  letter-spacing: .3px;
  cursor: pointer;
  transition: background .2s, border-color .2s, transform .05s;

  &:hover  { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.24); }
  &:active { transform: translateY(1px); }
`;

const Footer = styled.p`
  margin: 20px 0 0;
  text-align: center;
  color: rgba(255,255,255,.18);
  font-size: 10px;
  letter-spacing: 2.5px;
  font-weight: 700;
  text-transform: uppercase;
`;

/* ── Icons ── */
const UserIcon   = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>);
const LockIcon   = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.8"/></svg>);
const EyeIcon    = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8"/></svg>);
const EyeOffIcon = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12s3.5-7 10-7c2.1 0 4-.7 5.6 1.7M22 12s-3.5 7-10 7c-2.1 0-4-.7-5.6-1.7" stroke="currentColor" strokeWidth="1.8"/></svg>);

/* ════════════════════════════════════════════ */
export default function Step2() {
  const nav      = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || "/dashboard";
  const { login } = useAuth();

  const [values,    setValues]    = useState({ user: "", pass: "", remember: true });
  const [show,      setShow]      = useState(false);
  const [touched,   setTouched]   = useState({ user: false, pass: false });
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!values.user.trim()) e.user = "Ingresa tu usuario o correo";
    if (!values.pass)        e.pass = "Ingresa tu contraseña";
    else if (values.pass.length < 6) e.pass = "Mínimo 6 caracteres";
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;
  const update  = (key) => (ev) => {
    const value = key === "remember" ? ev.target.checked : ev.target.value;
    setValues((v) => ({ ...v, [key]: value }));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ user: true, pass: true });
    setServerErr("");
    if (!isValid) return;
    try {
      setLoading(true);
      await login({ user: values.user, pass: values.pass, remember: values.remember });
      nav(from, { replace: true });
    } catch (e) {
      setServerErr(e.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <GlobalStyle />
      <Grid />
      <TopGlow />
      <BottomGlow />

      <Card role="dialog" aria-labelledby="login-title">
        <Brand>
          <LogoText>LINKEO</LogoText>
          <TagLine>Tu identidad digital, al alcance de un tap</TagLine>
          <DividerLine><span>acceso</span></DividerLine>
        </Brand>

        <Form onSubmit={onSubmit} noValidate>
          <Field>
            Usuario o correo
            <InputWrap>
              <LeftIcon><UserIcon /></LeftIcon>
              <Input
                type="text"
                name="username"
                placeholder="tu@correo.com"
                value={values.user}
                onChange={update("user")}
                onBlur={() => setTouched((t) => ({ ...t, user: true }))}
                aria-invalid={touched.user && !!errors.user}
                autoComplete="username"
                inputMode="email"
              />
            </InputWrap>
            {touched.user && errors.user && <ErrorText>{errors.user}</ErrorText>}
          </Field>

          <Field>
            Contraseña
            <InputWrap>
              <LeftIcon><LockIcon /></LeftIcon>
              <Input
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={values.pass}
                onChange={update("pass")}
                onBlur={() => setTouched((t) => ({ ...t, pass: true }))}
                aria-invalid={touched.pass && !!errors.pass}
                autoComplete="current-password"
              />
              <RightBtn
                type="button"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOffIcon /> : <EyeIcon />}
              </RightBtn>
            </InputWrap>
            {touched.pass && errors.pass && <ErrorText>{errors.pass}</ErrorText>}
          </Field>

          <Row>
            <Check>
              <input type="checkbox" checked={values.remember} onChange={update("remember")} />
              Recordarme
            </Check>
          </Row>

          {serverErr && <ErrorText style={{ marginTop: 6 }}>{serverErr}</ErrorText>}

          <Submit type="submit" disabled={!isValid || loading}>
            {loading ? "Ingresando..." : "Ingresar →"}
          </Submit>

          <Secondary type="button" onClick={() => nav("/register")}>
            Crear cuenta
          </Secondary>

          <Footer>LINKEO OFICIAL · {new Date().getFullYear()}</Footer>
        </Form>
      </Card>
    </Page>
  );
}
