import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils/cn";
import type { ResolvedTheme } from "../utils/theme";

const PRESET_COLORS = [
  "#ffffff",
  "#fafafa",
  "#d4d4d4",
  "#a3a3a3",
  "#525252",
  "#404040",
  "#262626",
  "#171717",
  "#000000",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#e879f9",
  "#f472b6",
  "#fb7185",
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#4ade80",
  "#34d399",
  "#22d3ee",
];

const HEX_TO_TW: Record<string, string> = {
  "#ffffff": "white",
  "#fafafa": "neutral-50",
  "#d4d4d4": "neutral-300",
  "#a3a3a3": "neutral-400",
  "#525252": "neutral-600",
  "#404040": "neutral-700",
  "#262626": "neutral-800",
  "#171717": "neutral-900",
  "#000000": "black",
  "#38bdf8": "sky-400",
  "#60a5fa": "blue-400",
  "#818cf8": "indigo-400",
  "#a78bfa": "violet-400",
  "#c084fc": "purple-400",
  "#e879f9": "fuchsia-400",
  "#f472b6": "pink-400",
  "#fb7185": "rose-400",
  "#f87171": "red-400",
  "#fb923c": "orange-400",
  "#fbbf24": "amber-400",
  "#a3e635": "lime-400",
  "#4ade80": "green-400",
  "#34d399": "emerald-400",
  "#22d3ee": "cyan-400",
};

const ANGLE_TO_DIR: Record<number, string> = {
  0: "to-t",
  45: "to-tr",
  90: "to-r",
  135: "to-br",
  180: "to-b",
  225: "to-bl",
  270: "to-l",
  315: "to-tl",
};

/* ------------------------------------------------------------------ */
/*  Selection-ring contrast                                            */
/* ------------------------------------------------------------------ */

/* The surface the selection ring is drawn against — the control panel, not the
   card behind it, since that's what the swatches actually sit on. */
const PANEL: Record<ResolvedTheme, string> = { light: "#ffffff", dark: "#171717" };
/* A 1.5px ring is decorative, not text, so this sits far below the WCAG 4.5:1
   for copy — it's just the floor at which the hairline stops disappearing. */
const MIN_RING_CONTRAST = 1.6;

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function luminance(hex: string) {
  const [r, g, b] = channels(hex)
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function blend(hex: string, toward: string, amount: number) {
  const [a, b] = [channels(hex), channels(toward)];
  const mixed = a.map((c, i) => Math.round(c * (1 - amount) + b[i] * amount));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/* The selection ring wears the swatch's own color — but white on the light panel
   (or black on the dark one) is a ring you can't see. Walk the color toward the
   opposite end of the scale until it clears the floor above; anything that
   already contrasts is returned untouched, so saturated swatches keep their
   exact hue and only the near-invisible ends get pulled. */
function ringColor(hex: string, theme: ResolvedTheme) {
  const panel = PANEL[theme];
  const toward = theme === "dark" ? "#ffffff" : "#000000";
  for (let amount = 0; amount < 1; amount += 0.1) {
    const candidate = blend(hex, toward, amount);
    if (contrast(candidate, panel) >= MIN_RING_CONTRAST) return candidate;
  }
  return toward;
}

/* ------------------------------------------------------------------ */
/*  Panel primitives                                                   */
/* ------------------------------------------------------------------ */

/* One settings row: label in a fixed column on the left, control on the right.
   The fixed column is what actually lines the panel up — every control starts
   at the same x no matter how long its label is. */
function Field({
  label,
  align = "center",
  children,
}: {
  label: string;
  /** `start` for controls taller than one line, so the label sits on the first. */
  align?: "center" | "start";
  children: React.ReactNode;
}) {
  return (
    // Stacks below `sm`, where a fixed label column plus a control leaves too
    // little width for either. The control wrapper needs `min-w-0`: a flex child
    // defaults to `min-width: auto`, so without it the swatches refuse to shrink
    // and punch straight out of the panel instead of wrapping.
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:gap-4",
        align === "start" ? "sm:items-start" : "sm:items-center",
      )}
    >
      <span
        className={cn(
          "text-xs text-neutral-400 sm:w-12 sm:shrink-0",
          // Clears the segmented control's own padding so the two texts line up.
          align === "start" && "sm:pt-1.5",
        )}
      >
        {label}
      </span>
      <div className="min-w-0 sm:flex-1">{children}</div>
    </div>
  );
}

/* A real segmented control rather than a row of text buttons: a sunken track
   with one raised thumb that slides between options. The thumb is a
   smooth-shadow-ring-xs, so the page wears its sibling plugin. */
function Segmented({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-fit items-center gap-0.5 rounded-full p-0.5 bg-neutral-100 dark:bg-neutral-800">
      {children}
    </div>
  );
}

function Segment({
  active,
  layoutId,
  onClick,
  dot,
  children,
}: {
  active: boolean;
  layoutId: string;
  onClick: () => void;
  /** Hex to show as a swatch before the label — what this option currently is. */
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
        // A dot reads as its own left margin, so it needs less padding than text
        // would to sit the same distance off the pill's edge.
        dot ? "pr-2.5 pl-1.5" : "px-2.5",
        active
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-white dark:bg-neutral-700 smooth-shadow-ring-xs"
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {dot && (
          // The hairline keeps a white dot from vanishing into the raised thumb.
          <span
            className="size-2.5 rounded-full border border-black/10 dark:border-white/20"
            style={{ backgroundColor: dot }}
          />
        )}
        {children}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StopKey = "from" | "via" | "to";
type Stop = { color: string; position: number };
type Stops = Record<StopKey, Stop>;

/* ------------------------------------------------------------------ */
/*  Stop bar — draggable color stops on a gradient preview             */
/* ------------------------------------------------------------------ */

function StopBar({
  stops,
  onStopChange,
  selectedStop,
  onSelectStop,
}: {
  stops: Stops;
  onStopChange: (key: StopKey, position: number) => void;
  selectedStop: StopKey;
  onSelectStop: (key: StopKey) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<StopKey | null>(null);

  const getPosition = (clientX: number) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  const gradient = `linear-gradient(to right, ${stops.from.color} ${stops.from.position}%, ${stops.via.color} ${stops.via.position}%, ${stops.to.color} ${stops.to.position}%)`;

  return (
    <div
      ref={barRef}
      /* Inset by half a handle: the stops sit at 0% and 100% with a -50%
         translate, so without this the end handles hang over the panel's edge. */
      className="relative mx-2.5 h-3 rounded-full border border-neutral-200/60 dark:border-neutral-700/60"
      style={{ background: gradient, touchAction: "none" }}
    >
      {(["from", "via", "to"] as const).map((key) => (
        <motion.div
          key={key}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-5 rounded-full border-2 shadow-md cursor-grab active:cursor-grabbing",
            selectedStop === key
              ? "border-white ring-2 ring-neutral-900/10 dark:ring-white/30"
              : "border-white/80 dark:border-white/60",
          )}
          style={{
            left: `${stops[key].position}%`,
            backgroundColor: stops[key].color,
          }}
          animate={{ scale: dragging === key ? 1.3 : selectedStop === key ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setDragging(key);
            onSelectStop(key);
          }}
          onPointerMove={(e) => {
            if (dragging !== key) return;
            onStopChange(key, getPosition(e.clientX));
          }}
          onPointerUp={() => setDragging(null)}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Angle dial — rotatable direction input                             */
/* ------------------------------------------------------------------ */

function AngleDial({ angle, onChange }: { angle: number; onChange: (a: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const getAngle = (clientX: number, clientY: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let deg = Math.round(Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI) + 90);
    if (deg < 0) deg += 360;
    return deg;
  };

  return (
    <div
      ref={ref}
      className="relative size-8 -mb-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 cursor-pointer select-none"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        onChange(getAngle(e.clientX, e.clientY));
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        onChange(getAngle(e.clientX, e.clientY));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-neutral-800 dark:bg-white" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Copy snippet                                                       */
/* ------------------------------------------------------------------ */

function CopySnippet({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-3 w-full px-4 py-3 overflow-hidden">
      <div className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]">
        <pre className="tabular-nums font-normal text-sm whitespace-pre overflow-x-auto scrollbar-none">
          {value}
        </pre>
      </div>
      <button
        onClick={copy}
        className="relative text-sm cursor-pointer text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium h-5 w-12 shrink-0"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, filter: "blur(2px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(2px)", scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="block origin-right"
          >
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient configurator                                              */
/* ------------------------------------------------------------------ */

const LIGHT_DEFAULTS: Stops = {
  from: { color: "#ffffff", position: 0 },
  via: { color: "#fafafa", position: 50 },
  to: { color: "#ffffff", position: 100 },
};

const DARK_DEFAULTS: Stops = {
  from: { color: "#404040", position: 0 },
  via: { color: "#262626", position: 50 },
  to: { color: "#525252", position: 100 },
};

export function GradientConfigurator({ theme }: { theme: ResolvedTheme }) {
  const [stops, setStops] = useState<Stops>(() =>
    theme === "dark" ? DARK_DEFAULTS : LIGHT_DEFAULTS,
  );
  const [selectedStop, setSelectedStop] = useState<StopKey>("via");
  const [angle, setAngle] = useState(315);

  // Follow the theme the toggle resolved to, not the OS setting directly — a
  // manual light/dark choice has to move the defaults too.
  useEffect(() => {
    setStops(theme === "dark" ? DARK_DEFAULTS : LIGHT_DEFAULTS);
  }, [theme]);

  const handleStopPosition = (key: StopKey, position: number) => {
    setStops((prev) => ({ ...prev, [key]: { ...prev[key], position } }));
  };

  const handleColor = (hex: string) => {
    setStops((prev) => ({
      ...prev,
      [selectedStop]: { ...prev[selectedStop], color: hex },
    }));
  };

  const gradient = `linear-gradient(${angle}deg, ${stops.from.color} ${stops.from.position}%, ${stops.via.color} ${stops.via.position}%, ${stops.to.color} ${stops.to.position}%)`;

  const buildClasses = () => {
    const parts = ["gradient-border"];

    // Direction
    const dir = ANGLE_TO_DIR[angle];
    if (dir) {
      parts.push(`gradient-border-${dir}`);
    } else {
      parts.push(`[--gradient-border-angle:${angle}deg]`);
    }

    // From color
    const f = HEX_TO_TW[stops.from.color];
    parts.push(f ? `gradient-border-from-${f}` : `gradient-border-from-[${stops.from.color}]`);
    if (stops.from.position !== 0) parts.push(`from-${stops.from.position}%`);

    // Via color
    const v = HEX_TO_TW[stops.via.color];
    parts.push(v ? `gradient-border-via-${v}` : `gradient-border-via-[${stops.via.color}]`);
    if (stops.via.position !== 50) parts.push(`via-${stops.via.position}%`);

    // To color
    const t = HEX_TO_TW[stops.to.color];
    parts.push(t ? `gradient-border-to-${t}` : `gradient-border-to-[${stops.to.color}]`);
    if (stops.to.position !== 100) parts.push(`to-${stops.to.position}%`);

    return parts.join(" ");
  };

  const classString = buildClasses();

  return (
    <div className="w-full space-y-5">
      {/* Concentric radii: the card's 16px minus its 8px padding leaves exactly
          the panel's 8px, so the two curves stay parallel instead of the inner
          one bulging against a wider outer corner. */}
      <div className="p-2 rounded-2xl bg-neutral-50 dark:bg-neutral-950 space-y-2">
        {/* Preview bubble */}
        <div className="flex justify-center px-6 py-24">
          <div
            className="gradient-border rounded-full px-16 py-6 bg-linear-to-t from-neutral-100 to-white dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-800/80 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 cursor-pointer select-none"
            style={
              {
                "--gradient-border": gradient,
                "--gradient-border-width": "1.5px",
                boxShadow: [
                  "0 1px 6px rgba(0,0,0,0.02)",
                  "0 3px 12px rgba(0,0,0,0.02)",
                  "0 8px 24px rgba(0,0,0,0.01)",
                  "0 18px 40px rgba(0,0,0,0.02)",
                  "0 40px 80px rgba(0,0,0,0.02)",
                ].join(", "),
              } as React.CSSProperties
            }
          >
            <span className="text-2xl font-[450] text-neutral-800 dark:text-neutral-100">
              Preview
            </span>
          </div>
        </div>

        {/* The controls get their own raised surface inside the card, wearing
            the sibling shadow plugin's elevated-surface utility. A labelled
            panel gives every row one column to line up in. */}
        <div className="space-y-4 rounded-lg bg-white dark:bg-neutral-900 p-4 smooth-shadow-ring-xs">
          <Field label="Stops" align="start">
            <div className="space-y-3">
              <Segmented>
                {(["from", "via", "to"] as const).map((key) => (
                  <Segment
                    key={key}
                    active={selectedStop === key}
                    layoutId="stop-selector"
                    onClick={() => setSelectedStop(key)}
                    dot={stops[key].color}
                  >
                    {key}
                  </Segment>
                ))}
              </Segmented>
              <StopBar
                stops={stops}
                onStopChange={handleStopPosition}
                selectedStop={selectedStop}
                onSelectStop={setSelectedStop}
              />
            </div>
          </Field>

          <Field label="Angle">
            <AngleDial angle={angle} onChange={setAngle} />
          </Field>

          <Field label="Color" align="start">
            {/* Each dot carries a 28px transparent target around it — they were
                a pixel hunt at their own 20px size. `-mx-1` pulls that padding
                back out so the first dot's *edge* lands on the column, not its
                hit area. Wrapping against a 12-target cap rather than a fixed
                12-column grid: it still breaks two-by-twelve at full width, but
                reflows to whatever fits once the panel narrows, where a fixed
                grid would just overflow. */}
            <div className="-mx-1 flex w-full max-w-[21rem] flex-wrap items-center">
              {PRESET_COLORS.map((hex) => {
                const active = stops[selectedStop].color === hex;
                return (
                  <motion.button
                    key={hex}
                    type="button"
                    aria-label={`${selectedStop} ${HEX_TO_TW[hex] ?? hex}`}
                    aria-pressed={active}
                    title={HEX_TO_TW[hex] ?? hex}
                    onClick={() => handleColor(hex)}
                    className="group grid size-7 cursor-pointer place-items-center rounded-full outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  >
                    <span
                      className={cn(
                        "size-5 rounded-full border-[1.5px] transition-colors",
                        active
                          ? "border-black/5 ring-[1.5px] ring-offset-2 ring-offset-white dark:border-white/15 dark:ring-offset-neutral-900"
                          : "border-black/5 group-hover:border-black/10 dark:border-white/15 dark:group-hover:border-white/25",
                      )}
                      style={{
                        backgroundColor: hex,
                        // The swatch's own color rather than a fixed grey, so it
                        // reads as "this one" instead of a generic marker on top
                        // of it — contrast-corrected so it can't vanish.
                        ...(active ? { "--tw-ring-color": ringColor(hex, theme) } : {}),
                      }}
                    />
                  </motion.button>
                );
              })}
            </div>
          </Field>

          {/* The class string is the panel's output, so it lives in the panel —
              a hairline and the panel's own padding instead of a third bordered
              box nested inside the second. */}
          <div className="-mx-4 -mb-4 border-t border-neutral-200 dark:border-neutral-800">
            <CopySnippet value={classString} />
          </div>
        </div>
      </div>
    </div>
  );
}
