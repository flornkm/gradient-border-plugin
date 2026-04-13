import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils/cn";

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
      className="relative h-3 rounded-full border border-neutral-200/60 dark:border-neutral-700/60"
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
    <div className="flex items-start justify-between gap-3 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 overflow-hidden">
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

export function GradientConfigurator() {
  const [stops, setStops] = useState<Stops>(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_DEFAULTS
      : LIGHT_DEFAULTS,
  );
  const [selectedStop, setSelectedStop] = useState<StopKey>("via");
  const [angle, setAngle] = useState(315);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setStops(e.matches ? DARK_DEFAULTS : LIGHT_DEFAULTS);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
      <h2 className="font-semibold leading-tight">Try it out</h2>

      <div className="p-8 rounded-md bg-neutral-50 dark:bg-neutral-950 space-y-6">
        {/* Preview bubble */}
        <div className="flex justify-center py-24">
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

        {/* Stop bar + angle dial */}
        <div className="flex items-end gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Stops</span>
              <div className="flex items-center gap-1">
                {(["from", "via", "to"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStop(key)}
                    className={cn(
                      "relative text-xs cursor-pointer px-2 py-0.5 rounded-md transition-colors",
                      selectedStop === key
                        ? "text-neutral-900 dark:text-white font-medium"
                        : "text-neutral-400 hover:text-neutral-500",
                    )}
                  >
                    {selectedStop === key && (
                      <motion.span
                        layoutId="stop-bg"
                        className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                      />
                    )}
                    <span className="relative z-10">{key}</span>
                  </button>
                ))}
              </div>
            </div>
            <StopBar
              stops={stops}
              onStopChange={handleStopPosition}
              selectedStop={selectedStop}
              onSelectStop={setSelectedStop}
            />
          </div>

          <AngleDial angle={angle} onChange={setAngle} />
        </div>

        {/* Color presets */}
        <div className="flex gap-1 flex-wrap">
          {PRESET_COLORS.map((hex) => (
            <motion.button
              key={hex}
              onClick={() => handleColor(hex)}
              className={cn(
                "size-5 rounded-full cursor-pointer border-[1.5px] transition-colors",
                stops[selectedStop].color === hex
                  ? "border-black/30 dark:border-white/50"
                  : "border-black/5 dark:border-white/15 hover:border-black/10 dark:hover:border-white/25",
              )}
              style={{ backgroundColor: hex }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
          ))}
        </div>

        {/* Code snippet */}
        <CopySnippet value={classString} />
      </div>
    </div>
  );
}
