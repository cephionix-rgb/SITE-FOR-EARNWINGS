// Local-only preview config for owner review over a temporary tunnel (not used by builds).
import base from "./vite.config.ts";
const cfg = typeof base === "function" ? base({ mode: "production", command: "serve" }) : base;
export default { ...cfg, preview: { ...(cfg.preview || {}), allowedHosts: true } };
