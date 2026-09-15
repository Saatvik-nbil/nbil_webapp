/**
 * The assistant launcher's speech bubble.
 *
 * Phosphor's filled ChatCircleDots knocks its three dots out of the bubble, so
 * they read as holes showing the blue button through. Here the same bubble
 * path is drawn in currentColor and the three dots are painted back on top in
 * the nbil mark's own colours, in the order they run everywhere else on the
 * site: amber, indigo, magenta. Same geometry as the Phosphor glyph, so it
 * still sits like an icon rather than an illustration.
 */

const DOTS = [
  { cx: 84, fill: "#ffb92b" },
  { cx: 128, fill: "#2c30a0" },
  { cx: 172, fill: "#c40064" },
];

export default function BrandChatIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24ZM84,140a12,12,0,1,1,12-12A12,12,0,0,1,84,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,172,140Z"
        fill="currentColor"
      />
      {DOTS.map((dot) => (
        <circle key={dot.cx} cx={dot.cx} cy={128} r={12} fill={dot.fill} />
      ))}
    </svg>
  );
}
