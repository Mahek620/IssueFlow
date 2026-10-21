import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "./dark.css";
import AuthGate from "./AuthGate.jsx";

try {
  document.documentElement.dataset.theme =
    localStorage.getItem("theme") || "light";
} catch {
  document.documentElement.dataset.theme = "light";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthGate />
  </StrictMode>
);