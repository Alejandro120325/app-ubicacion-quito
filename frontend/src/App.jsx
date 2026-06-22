import React from "react";
import ThemeSelector from "./components/ThemeSelector.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <>
      <AppRoutes />
      <ThemeSelector />
    </>
  );
}

export default App;
