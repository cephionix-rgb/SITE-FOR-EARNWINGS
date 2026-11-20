/**
 * Captain Aezon's portrait: the same character art the app uses for his chat avatar
 * (EARNWINGS Student App/public/captain-aezon.png), resized to WebP at 128/256/480 px in
 * public/aezon/. The art is already round with its own white disc, so it is shown with
 * `contain` and never re-cropped.
 */
export const AEZON_ALT = "Captain Aezon, the EARNWINGS ground instructor: a smiling pilot in a navy uniform and captain's cap";

export function AezonPortrait({ size = 56, className = "", ring = true, alt = AEZON_ALT, eager = false, square = false }: {
  size?: number; className?: string; ring?: boolean; alt?: string; eager?: boolean;
  /** Fit inside a size × size box (icons, chips) instead of the art's own 579:640. */
  square?: boolean;
}) {
  const h = square ? size : Math.round(size * 640 / 579);
  return (
    <img
      src={size > 160 ? "/aezon/captain-aezon-480.webp" : "/aezon/captain-aezon-256.webp"}
      srcSet="/aezon/captain-aezon-128.webp 128w, /aezon/captain-aezon-256.webp 256w, /aezon/captain-aezon-480.webp 480w"
      sizes={`${size}px`}
      width={size} height={h} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false}
      className={className}
      style={{
        width: size, height: h, objectFit: "contain", display: "block", flexShrink: 0,
        borderRadius: "50%",
        filter: ring ? "drop-shadow(0 6px 14px rgba(13,36,80,0.22))" : undefined,
      }}
    />
  );
}
