/**
 * Site-wide animated cloud sky. Rendered INLINE (it used to be an <iframe>
 * pointing at public/clouds-bg.html, which was an entire extra document to
 * parse, lay out and keep in memory). Fixed behind all page content (z-index
 * -10), pointer-events none. The plate is served as optimised AVIF/WebP via
 * image-set with a JPEG fallback. Classes are ewsky-prefixed so they cannot
 * collide with app styles. All three layers drift + breathe on every screen
 * size (blur is only trimmed on mobile for scroll perf); animation is fully
 * disabled for prefers-reduced-motion.
 */
const CSS = `
.ewsky{position:fixed;inset:0;z-index:-10;overflow:hidden;pointer-events:none;background:linear-gradient(180deg,#EAF4FF 0%,#D9EAFC 38%,#C9E0F8 66%,#E8F2FF 100%);}
.ewsky-sun{position:absolute;left:74%;top:6%;width:54vmax;height:54vmax;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,247,220,0.9) 0%,rgba(245,217,122,0.32) 28%,rgba(245,217,122,0.09) 46%,transparent 62%);filter:blur(6px);animation:ewsky-sun 20s ease-in-out infinite alternate;}
@keyframes ewsky-sun{from{opacity:.8;transform:translate(-50%,-50%) scale(1);}to{opacity:1;transform:translate(-50%,-50%) scale(1.12);}}
.ewsky-cloud{position:absolute;inset:-18%;background-position:center;background-size:cover;background-repeat:no-repeat;background-image:url('/assets/hero-clouds-1920.jpg');background-image:image-set(url('/assets/hero-clouds-1920.avif') type('image/avif'),url('/assets/hero-clouds-1920.webp') type('image/webp'),url('/assets/hero-clouds-1920.jpg') type('image/jpeg'));filter:blur(1.5px);will-change:transform;}
.ewsky-c1{opacity:.58;animation:ewsky-d1 20s ease-in-out infinite alternate;}
.ewsky-c2{opacity:.66;animation:ewsky-d2 16s ease-in-out infinite alternate;}
.ewsky-c3{opacity:.48;animation:ewsky-d3 26s ease-in-out infinite alternate;}
@keyframes ewsky-d1{0%{transform:translate(-6%,-2%) scale(1.06);}50%{transform:translate(2%,2%) scale(1.17);}100%{transform:translate(6%,-2%) scale(1.06);}}
@keyframes ewsky-d2{0%{transform:translate(6%,2%) scale(1.10);}50%{transform:translate(-2%,-2%) scale(1.22);}100%{transform:translate(-6%,2%) scale(1.10);}}
@keyframes ewsky-d3{0%{transform:translate(-5%,3%) scale(1.16);}50%{transform:translate(2%,-2%) scale(1.06);}100%{transform:translate(5%,3%) scale(1.16);}}
.ewsky-wash{position:absolute;inset:0;background:linear-gradient(180deg,rgba(244,249,255,0.34) 0%,rgba(244,249,255,0.14) 45%,rgba(244,249,255,0.36) 100%);}
/* Mobile: the cloud plate is a wide landscape with clouds in the top-right and
   bottom-left and clear sky through the middle. On a narrow portrait viewport a
   centred 'cover' crops straight into that empty middle, so the phone looked
   cloudless. Aim each layer at a cloud region instead so real clouds fill the
   screen; keep all three drifting (blur only trimmed for scroll perf). */
@media (max-width:768px){
  /* Size by width so the whole landscape (both cloud groups) shows as a band
     instead of cover cropping into the empty-sky middle; stack the three layers
     at top / middle / bottom so clouds fill the phone with sky peeking between. */
  .ewsky-cloud{filter:blur(1px);background-size:135% auto;}
  .ewsky-c1{background-position:60% 6%;opacity:.72;}
  .ewsky-c2{background-position:15% 52%;opacity:.76;}
  .ewsky-c3{background-position:85% 100%;opacity:.7;}
  .ewsky-wash{opacity:.5;}
}
@media (prefers-reduced-motion:reduce){.ewsky-cloud,.ewsky-sun{animation:none;}}
`;

export function CloudBackground() {
  return (
    <div className="ewsky" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ewsky-sun" />
      <div className="ewsky-cloud ewsky-c3" />
      <div className="ewsky-cloud ewsky-c1" />
      <div className="ewsky-cloud ewsky-c2" />
      <div className="ewsky-wash" />
    </div>
  );
}
