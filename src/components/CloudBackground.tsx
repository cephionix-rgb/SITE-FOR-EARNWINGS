/**
 * Unified page background: one self-contained animated cloud sky
 * (`public/clouds-bg.html`) rendered as a fixed, click-through iframe behind all
 * page content. Sections above it keep transparent backgrounds so this single
 * sky flows continuously down the whole page.
 */
export function CloudBackground() {
  return (
    <iframe
      src="/clouds-bg.html"
      title=""
      aria-hidden
      tabIndex={-1}
      loading="eager"
      className="pointer-events-none fixed inset-0 border-0"
      style={{ width: "100vw", height: "100vh", zIndex: -10 }}
    />
  );
}
