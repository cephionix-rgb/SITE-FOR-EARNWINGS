import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "./styles/globals.css";
import App from "./App";

// MotionConfig reducedMotion="user" makes every Framer Motion animation on the
// site respect the OS prefers-reduced-motion setting (the CSS media query only
// covers CSS animations, not Framer's JS-driven transforms).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
