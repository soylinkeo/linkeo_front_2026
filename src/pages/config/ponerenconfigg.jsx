
// // src/pages/Config.jsx
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// import { Wrap, Header, Actions } from "../pages/config/styles";
// import PresetsBar from "../pages/config/components/PresetsBar";
// import PreviewColumn from "../pages/config/components/PreviewColumn";
// import EditorColumn from "../pages/config/components/EditorColumn";

// import useProfileConfig from "../pages/config/hooks/useProfileConfig";

// export default function Config() {
//   const nav = useNavigate();
//   const { isAuthed } = useAuth();

//   // Si no está autenticado, manda a login
//   useEffect(() => {
//     if (!isAuthed) nav("/login", { replace: true, state: { from: { pathname: "/config" } } });
//   }, [isAuthed, nav]);

//   const cfg = useProfileConfig(); // ✅ toda la lógica vive aquí

//   if (!isAuthed) return null;

//   return (
//     <Wrap>
//       <Header>
//         <h1>{cfg.headerTitle}</h1>
//         <Actions>{/* tus botones globales si quieres */}</Actions>
//       </Header>

//       <PresetsBar
//         presets={cfg.STYLE_PRESETS}
//         applyPreset={cfg.applyPreset}
//         surprise={cfg.surprise}
//       />

//       <cfg.Grid>
//         <PreviewColumn cfg={cfg} />
//         <EditorColumn cfg={cfg} />
//       </cfg.Grid>
//     </Wrap>
//   );
// }