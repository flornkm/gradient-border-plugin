function BookmarkIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="21 7 21 13 15 13" />
      <path d="M3 17a9 9 0 0 1 14.7-7L21 13" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

const themes = {
  dark: {
    section: "bg-black text-neutral-300",
    topGlow:
      "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(168,162,255,0.10) 0%, transparent 60%)",
    frameBg:
      "linear-gradient(to bottom, #161616 0%, #101010 30%, #080808 70%, #050505 100%)",
    frameBorder:
      "radial-gradient(420px circle at var(--mx, 50%) var(--my, -10%), rgba(255,255,255,0.10), rgba(255,255,255,0.01) 40%, transparent 70%), linear-gradient(to bottom, rgba(64,64,64,0.35), rgba(23,23,23,0.2), rgba(10,10,10,0.04))",
    sidebarBg: "linear-gradient(to bottom, #131313 0%, #0e0e0e 50%, #080808 100%)",
    middleBg: "linear-gradient(to bottom, #1c1c1c 0%, #161616 50%, #0e0e0e 100%)",
    middleBorder:
      "radial-gradient(320px circle at var(--mx, 50%) var(--my, -10%), rgba(255,255,255,0.12), rgba(255,255,255,0.01) 40%, transparent 70%), linear-gradient(to bottom, rgba(64,64,64,0.35), rgba(23,23,23,0.2), rgba(10,10,10,0.04))",
    rightBg: "linear-gradient(to bottom, #171717 0%, #131313 50%, #0c0c0c 100%)",
    skeleton: "bg-neutral-900",
    label: "text-neutral-600",
    divider: "rgba(115,115,115,0.18)",
  },
  light: {
    section: "bg-neutral-50 text-neutral-700",
    topGlow:
      "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(99,102,241,0.06) 0%, transparent 60%)",
    frameBg:
      "linear-gradient(to bottom, #ffffff 0%, #f8f8f8 30%, #f1f1f1 70%, #ebebeb 100%)",
    frameBorder:
      "radial-gradient(420px circle at var(--mx, 50%) var(--my, -10%), rgba(0,0,0,0.10), rgba(0,0,0,0.01) 40%, transparent 70%), linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.08), rgba(0,0,0,0.02))",
    sidebarBg: "linear-gradient(to bottom, #f6f6f6 0%, #efefef 50%, #e7e7e7 100%)",
    middleBg: "linear-gradient(to bottom, #ffffff 0%, #fafafa 50%, #f2f2f2 100%)",
    middleBorder:
      "radial-gradient(320px circle at var(--mx, 50%) var(--my, -10%), rgba(0,0,0,0.10), rgba(0,0,0,0.01) 40%, transparent 70%), linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.08), rgba(0,0,0,0.02))",
    rightBg: "linear-gradient(to bottom, #f8f8f8 0%, #f2f2f2 50%, #eaeaea 100%)",
    skeleton: "bg-neutral-200",
    label: "text-neutral-400",
    divider: "rgba(0,0,0,0.08)",
  },
} as const;

function LinearMockup({ theme }: { theme: "dark" | "light" }) {
  const t = themes[theme];
  const trackMouse = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <section
      className={`h-screen w-full flex items-center justify-center px-6 relative overflow-hidden ${t.section}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: t.topGlow }}
      />
      <div
        className="gradient-border w-full max-w-6xl h-[640px] rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] flex relative gap-2 p-2"
        onMouseMove={trackMouse}
        style={{
          background: t.frameBg,
          ["--gradient-border" as string]: t.frameBorder,
        }}
      >
        {/* SIDEBAR */}
        <aside
          className="w-60 flex flex-col shrink-0 rounded-lg overflow-hidden"
          style={{ background: t.sidebarBg }}
        >
          <div className="h-12 flex items-center justify-between px-3 relative">
            <div className="flex items-center gap-2 px-1.5">
              <span className={`size-5 rounded-full ${t.skeleton}`} />
              <span className={`h-2.5 w-12 rounded ${t.skeleton}`} />
              <span className={`h-2.5 w-2 rounded ${t.skeleton}`} />
            </div>
            <div className="flex items-center gap-1">
              <span className={`size-7 rounded-md ${t.skeleton}`} />
              <span className={`size-7 rounded-md ${t.skeleton}`} />
            </div>
            <span
              className="absolute bottom-0 inset-x-3 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${t.divider}, transparent)`,
              }}
            />
          </div>

          <div className="flex-1 overflow-hidden p-2 flex flex-col gap-0.5">
            {[32, 56, 40, 48, 44].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2 h-8 rounded-md">
                <span className={`size-3.5 rounded-sm ${t.skeleton}`} />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${w}px` }} />
              </div>
            ))}

            {[60, 44, 52].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2 h-8 rounded-md">
                <span className={`size-3.5 rounded-sm ${t.skeleton}`} />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${w}px` }} />
              </div>
            ))}

            <div className="mt-4 mb-1 px-3">
              <span
                className={`text-[10px] uppercase tracking-[0.16em] font-medium ${t.label}`}
              >
                Teams
              </span>
            </div>
            {[68, 56].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2 h-8 rounded-md">
                <span className={`size-3.5 rounded-sm ${t.skeleton}`} />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${w}px` }} />
              </div>
            ))}
          </div>
        </aside>

        {/* MIDDLE */}
        <main
          className="gradient-border flex-1 min-w-0 flex flex-col rounded-lg overflow-hidden"
          onMouseMove={trackMouse}
          style={{
            background: t.middleBg,
            ["--gradient-border" as string]: t.middleBorder,
          }}
        >
          <div className="h-12 flex items-center justify-between px-5 relative">
            <div className="flex items-center gap-2.5">
              <span className={`h-3 w-28 rounded ${t.skeleton}`} />
              <span className={`size-3.5 rounded-sm ${t.skeleton}`} />
              <span className={`size-3.5 rounded-sm ${t.skeleton}`} />
            </div>
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-10 rounded ${t.skeleton}`} />
              <span className={`size-5 rounded ${t.skeleton}`} />
              <span className={`size-5 rounded ${t.skeleton}`} />
            </div>
            <span
              className="absolute bottom-0 inset-x-5 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${t.divider}, transparent)`,
              }}
            />
          </div>

          <div className="px-5 pt-6 pb-4 flex flex-col gap-3">
            <span className={`h-7 w-72 rounded ${t.skeleton}`} />
            <span className={`h-3 w-full max-w-md rounded ${t.skeleton}`} />
            <span className={`h-3 w-2/3 max-w-md rounded ${t.skeleton}`} />
          </div>

          <div className="flex-1 overflow-hidden px-2">
            {[240, 320, 180, 280, 220, 300].map((w, i) => (
              <div key={i} className="flex items-center gap-3 px-3 h-10">
                <span className={`size-3 rounded-full ${t.skeleton}`} />
                <span className={`h-2.5 w-9 rounded ${t.skeleton}`} />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${w}px` }} />
                <span className={`ml-auto h-2.5 w-12 rounded ${t.skeleton}`} />
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT */}
        <aside
          className="w-80 shrink-0 flex flex-col rounded-lg overflow-hidden"
          style={{ background: t.rightBg }}
        >
          <div className="h-12 flex items-center justify-between px-5 relative">
            <span className={`h-2.5 w-16 rounded ${t.skeleton}`} />
            <div className="flex items-center gap-1">
              <span className={`size-5 rounded-sm ${t.skeleton}`} />
              <span className={`size-5 rounded-sm ${t.skeleton}`} />
              <span className={`size-5 rounded-sm ${t.skeleton}`} />
            </div>
            <span
              className="absolute bottom-0 inset-x-5 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${t.divider}, transparent)`,
              }}
            />
          </div>

          <div className="px-5 py-5 flex flex-col gap-4">
            {[
              { label: 56, val: 80 },
              { label: 56, val: 100 },
              { label: 56, val: 64 },
              { label: 56, val: 92 },
              { label: 56, val: 72 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span
                  className={`h-2.5 rounded ${t.skeleton}`}
                  style={{ width: `${r.label}px` }}
                />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${r.val}px` }} />
              </div>
            ))}
          </div>

          <div className="px-5 mt-2">
            <span
              className="block h-px w-full"
              style={{
                background: `linear-gradient(to right, transparent, ${t.divider}, transparent)`,
              }}
            />
          </div>

          <div className="px-5 py-5 flex flex-col gap-4">
            {[
              { label: 48, val: 88 },
              { label: 48, val: 64 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span
                  className={`h-2.5 rounded ${t.skeleton}`}
                  style={{ width: `${r.label}px` }}
                />
                <span className={`h-2.5 rounded ${t.skeleton}`} style={{ width: `${r.val}px` }} />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function Examples() {
  return (
    <main>
      <section className="h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-white">
        <div
          className="
            gradient-border animate-gradient-border
            gradient-border-from-sky-300
            gradient-border-via-white
            gradient-border-to-pink-300
            [--gradient-border-duration:5s]
            relative rounded-full overflow-hidden
            px-10 py-6 flex items-center gap-10
            backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-105
            shadow-[0_18px_40px_-18px_rgba(23,23,23,0.35),0_2px_6px_-2px_rgba(23,23,23,0.15),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(23,23,23,0.06),inset_0_-1px_0_rgba(23,23,23,0.05)]
            text-neutral-900
          "
          style={{
            background:
              "linear-gradient(var(--gradient-border-rotation), rgba(191,219,254,0.4) 0%, rgba(212,212,216,0.35) 50%, rgba(251,207,232,0.4) 100%)",
          }}
        >
          {/* faint top highlight arc */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0.5 h-1/3 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 75%)",
            }}
          />
          <BookmarkIcon />
          <RedoIcon />
          <MoreIcon />
        </div>
      </section>

      <section className="h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-white">
        <button
          type="button"
          className="
            inline-block gradient-border-2 gradient-border-to-t
            gradient-border-from-white gradient-border-to-neutral-200
            dark:gradient-border-to-neutral-700 dark:gradient-border-from-neutral-700/20
            shadow-2xl shadow-black/10
            cursor-pointer
            px-16 py-8 rounded-full
            bg-linear-to-t from-neutral-200 to-white
            dark:from-neutral-800 dark:to-neutral-800/80
            transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:brightness-105 active:scale-95
            text-5xl font-medium tracking-tight
          "
        >
          Gradient Border
        </button>
      </section>

      <LinearMockup theme="dark" />
      <LinearMockup theme="light" />

      <section
        className="h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #d8d8d8 0%, #b8b8b8 50%, #9a9a9a 100%)",
          perspective: "1400px",
        }}
      >
        <style>{`
          .tilt-squircle {
            transform-style: preserve-3d;
            transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform;
          }
          .tilt-squircle::before {
            padding: var(--gb-pt, 8px) var(--gb-pr, 8px) var(--gb-pb, 8px) var(--gb-pl, 8px) !important;
            transition: padding 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .tilt-inner {
            transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
            transform: translateZ(24px);
          }
        `}</style>

        <div
          className="tilt-squircle gradient-border gradient-border-to-b rounded-[26%] shrink-0 flex items-center justify-center
            gradient-border-from-white gradient-border-via-neutral-400 gradient-border-to-neutral-700"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const tx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
            const ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
            const tilt = 7;
            const base = 8;
            const off = 4;
            const el = e.currentTarget;
            el.style.transform = `rotateY(${-tx * tilt}deg) rotateX(${ty * tilt}deg)`;
            el.style.setProperty("--gb-pt", `${base - ty * off}px`);
            el.style.setProperty("--gb-pb", `${base + ty * off}px`);
            el.style.setProperty("--gb-pl", `${base - tx * off}px`);
            el.style.setProperty("--gb-pr", `${base + tx * off}px`);
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "";
            el.style.removeProperty("--gb-pt");
            el.style.removeProperty("--gb-pb");
            el.style.removeProperty("--gb-pl");
            el.style.removeProperty("--gb-pr");
          }}
          style={{
            width: 360,
            height: 360,
            background: "#0d0d0d",
            ["--gradient-border-width" as string]: "8px",
          }}
        >
          <div
            className="tilt-inner gradient-border gradient-border-to-b rounded-full shrink-0
              gradient-border-from-neutral-200 gradient-border-via-neutral-500 gradient-border-to-neutral-800"
            style={{
              width: 180,
              height: 180,
              background:
                "linear-gradient(180deg, #e8e8e8 0%, #b6b6b6 50%, #888888 100%)",
              ["--gradient-border-width" as string]: "6px",
            }}
          />
        </div>
      </section>

      <section
        className="h-screen w-full flex items-center justify-center relative overflow-hidden px-10"
        style={{ background: "#e8e6e0", color: "#0a0a0a" }}
      >
        <style>{`
          @keyframes border-bauhaus-sweep {
            from { background-position: 0% 0%, 0% 0%; }
            to   { background-position: 0% 0%, -100% 0%; }
          }
        `}</style>

        {/* big striped Border */}
        <div className="relative w-full flex items-center justify-center">
          <h2
            className="font-black tracking-[-0.04em] leading-none select-none text-center"
            style={{
              fontSize: "clamp(8rem, 22vw, 22rem)",
              backgroundImage: [
                // mask: stripe widths progress from 1px (top) → 4px (bottom)
                `linear-gradient(to bottom, ${variableMaskStops("#e8e6e0")})`,
                // palindromic palette so it tiles seamlessly when scrolled
                "linear-gradient(to right, #b54a16 0%, #d68649 12.5%, #1a1a1a 25%, #5d99c5 37.5%, #2a6a99 50%, #5d99c5 62.5%, #1a1a1a 75%, #d68649 87.5%, #b54a16 100%)",
              ].join(", "),
              backgroundSize: "100% 100%, 200% 100%",
              backgroundRepeat: "no-repeat, repeat",
              animation: "border-bauhaus-sweep 14s linear infinite",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Border
          </h2>
        </div>
      </section>

      <section
        className="h-screen w-full flex flex-col items-center justify-between py-16 relative overflow-hidden"
        style={{ background: "#f1ead7", color: "#1a1a1a" }}
      >
        <div className="w-full max-w-2xl px-10 flex items-start justify-between">
          <h2 className="font-black text-5xl md:text-6xl tracking-tight leading-[0.85]">
            BAU
            <br />
            HAUS
          </h2>
          <span className="font-black text-4xl md:text-5xl tracking-tight">1923</span>
        </div>

        <div className="w-full max-w-2xl px-10 flex-1 flex items-end justify-between gap-8 pb-0 relative">
          {/* ORANGE ARCHES */}
          <div className="relative h-[340px] flex-1 max-w-[280px] flex items-end justify-center">
            {[
              { c: "#b54a16", s: 110 },
              { c: "#c2632b", s: 150 },
              { c: "#d68649", s: 190 },
              { c: "#e3a571", s: 230 },
              { c: "#edc098", s: 270 },
              { c: "#f1d4b3", s: 310 },
            ].map((a, i) => (
              <div
                key={i}
                className="gradient-border animate-gradient-border absolute bottom-0 rounded-full [--gradient-border-duration:7s]"
                style={{
                  width: `${a.s}px`,
                  height: `${a.s}px`,
                  left: `calc(50% - ${a.s / 2}px)`,
                  ["--gradient-border-width" as string]: "14px",
                  ["--gradient-border-from" as string]: a.c,
                  ["--gradient-border-via" as string]: shade(a.c, 22),
                  ["--gradient-border-to" as string]: a.c,
                }}
              />
            ))}
          </div>

          {/* BLUE ARCHES */}
          <div className="relative h-[340px] flex-1 max-w-[280px] flex items-end justify-center">
            {[
              { c: "#2a6a99", s: 110 },
              { c: "#3a7eb0", s: 150 },
              { c: "#5d99c5", s: 190 },
              { c: "#88b7d5", s: 230 },
              { c: "#aacde0", s: 270 },
              { c: "#c4dceb", s: 310 },
            ].map((a, i) => (
              <div
                key={i}
                className="gradient-border animate-gradient-border absolute bottom-0 rounded-full [--gradient-border-duration:7s]"
                style={{
                  width: `${a.s}px`,
                  height: `${a.s}px`,
                  left: `calc(50% - ${a.s / 2}px)`,
                  ["--gradient-border-width" as string]: "14px",
                  ["--gradient-border-from" as string]: a.c,
                  ["--gradient-border-via" as string]: shade(a.c, 22),
                  ["--gradient-border-to" as string]: a.c,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

/**
 * Build linear-gradient stops where stripe widths progress from minW (top) → maxW (bottom).
 * `gapColor` fills the gap rows; `stripeColor` fills the visible rows (defaults to transparent).
 */
const MASK_N = 28;
const MASK_MIN = 1;
const MASK_MAX = 4;
const MASK_GAP = 7;

function variableMaskStops(
  gapColor: string,
  stripeColor: string = "transparent",
): string {
  // total "units" so we can express stops as percentages — gradient stretches with element
  let total = 0;
  for (let i = 0; i < MASK_N; i++) {
    const w = MASK_MIN + (i / (MASK_N - 1)) * (MASK_MAX - MASK_MIN);
    total += w + MASK_GAP;
  }
  const parts: string[] = [];
  let y = 0;
  for (let i = 0; i < MASK_N; i++) {
    const w = MASK_MIN + (i / (MASK_N - 1)) * (MASK_MAX - MASK_MIN);
    const a = (y / total) * 100;
    const b = ((y + w) / total) * 100;
    const c = ((y + w + MASK_GAP) / total) * 100;
    parts.push(`${stripeColor} ${a}%`, `${stripeColor} ${b}%`);
    parts.push(`${gapColor} ${b}%`, `${gapColor} ${c}%`);
    y += w + MASK_GAP;
  }
  return parts.join(", ");
}
