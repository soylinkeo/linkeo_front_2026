// src/pages/Register.jsx
import React, { useMemo, useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
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
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #0a0a0a;
  font-family: "Poppins", system-ui, sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    top: -180px; left: -160px;
    background: radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 70%);
    animation: ${rotateBg} 18s linear infinite;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    bottom: -140px; right: -120px;
    background: radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 70%);
    animation: ${rotateBg} 22s linear infinite reverse;
    pointer-events: none;
  }
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
  animation: ${pulse} 6s ease-in-out infinite;
`;

/* ── Card ── */
const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 50%, #1c1c1c 100%);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 28px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.04),
    0 40px 80px rgba(0,0,0,.8),
    inset 0 1px 0 rgba(255,255,255,.08);
  padding: 44px 38px 36px;
  animation: ${floatIn} .5s cubic-bezier(.22,1,.36,1) both;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
    border-radius: 999px;
  }
`;

/* ── Brand ── */
const Brand = styled.div`
  text-align: center;
  margin-bottom: 28px;
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
  color: rgba(255,255,255,.4);
  letter-spacing: .3px;
`;

const DividerLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 0;

  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
  }

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(255,255,255,.25);
    text-transform: uppercase;
  }
`;

/* ── Form ── */
const Form = styled.form`
  display: grid;
  gap: 14px;
`;

const Field = styled.label`
  display: grid;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,.5);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Input = styled.input`
  height: 50px;
  padding: 10px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.05);
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;

  &::placeholder { color: rgba(255,255,255,.2); }
  &:hover  {
    border-color: rgba(255,255,255,.18);
    background: rgba(255,255,255,.07);
  }
  &:focus  {
    border-color: rgba(255,255,255,.45);
    background: rgba(255,255,255,.09);
    box-shadow: 0 0 0 3px rgba(255,255,255,.06), 0 0 20px rgba(255,255,255,.04);
  }
  &[aria-invalid="true"] {
    border-color: rgba(239,68,68,.6);
    box-shadow: 0 0 0 3px rgba(239,68,68,.12);
  }
`;

const ErrorText = styled.div`
  color: #f87171;
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
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
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  color: rgba(255,255,255,.8);
  font-weight: 700;
  font-size: 14px;
  font-family: inherit;
  letter-spacing: .3px;
  cursor: pointer;
  transition: background .2s, border-color .2s, transform .05s;

  &:hover  { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.25); }
  &:active { transform: translateY(1px); }
`;

const Footer = styled.p`
  margin: 20px 0 0;
  text-align: center;
  color: rgba(255,255,255,.15);
  font-size: 10px;
  letter-spacing: 2.5px;
  font-weight: 700;
  text-transform: uppercase;
`;

/* ════════════════════════════════════════════ */
export default function Register() {
  const nav = useNavigate();
  const { register: registerUser } = useAuth();

  const [values,    setValues]    = useState({ username: "", email: "", pass: "", pass2: "" });
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!values.username.trim() || values.username.trim().length < 2) e.username = "Mínimo 2 caracteres";
    if (!values.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) e.email = "Correo inválido";
    if (!values.pass) e.pass = "Ingresa una contraseña";
    else if (values.pass.length < 6) e.pass = "Mínimo 6 caracteres";
    if (values.pass2 !== values.pass) e.pass2 = "Las contraseñas no coinciden";
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;
  const update  = (k) => (ev) => setValues((v) => ({ ...v, [k]: ev.target.value }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerErr("");
    if (!isValid) return;
    try {
      setLoading(true);
      await registerUser({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.pass,
        remember: true,
      });
      nav("/dashboard", { replace: true });
    } catch (e) {
      setServerErr(e.message || "Error de registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <GlobalStyle />
      <Grid />

      <Card role="dialog" aria-labelledby="register-title">
        <Brand>
          <LogoText>LINKEO</LogoText>
          <TagLine>Tu identidad digital, al alcance de un tap</TagLine>
          <DividerLine><span>registro</span></DividerLine>
        </Brand>

        <Form onSubmit={onSubmit} noValidate>
          <Field>
            Usuario (linkeo.com/usuario)
            <Input
              type="text"
              name="username"
              placeholder="tu_usuario"
              value={values.username}
              onChange={update("username")}
              aria-invalid={!!errors.username}
              autoComplete="username"
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </Field>

          <Field>
            Correo
            <Input
              type="email"
              name="email"
              placeholder="tu@correo.com"
              value={values.email}
              onChange={update("email")}
              aria-invalid={!!errors.email}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </Field>

          <Field>
            Contraseña
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.pass}
              onChange={update("pass")}
              aria-invalid={!!errors.pass}
              autoComplete="new-password"
            />
            {errors.pass && <ErrorText>{errors.pass}</ErrorText>}
          </Field>

          <Field>
            Repite la contraseña
            <Input
              type="password"
              name="password2"
              placeholder="••••••••"
              value={values.pass2}
              onChange={update("pass2")}
              aria-invalid={!!errors.pass2}
              autoComplete="new-password"
            />
            {errors.pass2 && <ErrorText>{errors.pass2}</ErrorText>}
          </Field>

          {serverErr && <ErrorText style={{ marginTop: 6 }}>{serverErr}</ErrorText>}

          <Submit type="submit" disabled={!isValid || loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta →"}
          </Submit>

          <Secondary type="button" onClick={() => nav("/login")}>
            Ya tengo cuenta
          </Secondary>

          <Footer>LINKEO OFICIAL · {new Date().getFullYear()}</Footer>
        </Form>
      </Card>
    </Page>
  );
}
