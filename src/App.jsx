// App.jsx
import { Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Config from "./pages/Config";
import Login from "./pages/login";
import Tarjeta from "./pages/tarjeta";
import LandingPage from "./pages/land";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import PublicProfile from "./pages/PublicProfile";
import SessionGuard from "./components/SessionGuard"; // 👈 1. Importar
import Analytics from "./pages/Analytics";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <AuthProvider>
        <SessionGuard /> {/* 👈 2. Agregar aquí, dentro de AuthProvider */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/config"
            element={
              <RequireAuth>
                <Config />
              </RequireAuth>
            }
          />
          <Route
            path="/designCard"
            element={
              <RequireAuth>
                <Tarjeta />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route
  path="/analytics"
  element={
    <RequireAuth>
      <Analytics />
    </RequireAuth>
  }
/>
         <Route path="/:slug" element={<PublicProfile />} />
 
          
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
