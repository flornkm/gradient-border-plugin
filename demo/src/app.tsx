import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils/cn";
import { GradientConfigurator } from "./components/gradient-configurator";

const INSTALL_COMMANDS = [
  { label: "npm", command: "npm i gradient-border-plugin" },
  { label: "pnpm", command: "pnpm add gradient-border-plugin" },
  { label: "yarn", command: "yarn add gradient-border-plugin" },
  { label: "bun", command: "bun add gradient-border-plugin" },
];

function CodeField({ code, prefix }: { code: string; prefix?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-3 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 overflow-hidden">
      <div className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]">
        <pre className="tabular-nums font-normal text-sm whitespace-pre overflow-x-auto scrollbar-none">
          {prefix && <span className="text-neutral-300 dark:text-neutral-600 mr-2">{prefix}</span>}
          {code}
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

function App() {
  const [pm, setPm] = useState(0);

  return (
    <main className="min-h-screen px-4 pt-4 md:py-20">
      <div className="w-full max-w-3xl flex space-y-8 flex-col items-start mx-auto">
        <div className="space-y-2">
          <h1 className="text-base font-medium leading-tight">Gradient Border Plugin</h1>
          <p className="text-sm mb-1.5 leading-tight text-neutral-400">
            A simple Tailwind plugin for beautiful gradient borders using mask-composite.
          </p>
        </div>

        <p className="text-base">
          This tailwind plugin lets you create custom border gradients. With it you can create{" "}
          <span className="inline-block gradient-border gradient-border-to-t gradient-border-from-white gradient-border-to-neutral-200 dark:gradient-border-to-neutral-700 dark:gradient-border-from-neutral-700/20 shadow-lg shadow-black/5 cursor-pointer px-3 py-1 rounded-full bg-linear-to-t from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-800/80 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 align-middle">
            Glass Buttons
          </span>
          ,{" "}
          <span className="inline-block size-8 rounded-full gradient-border gradient-border-to-tl gradient-border-from-white gradient-border-via-neutral-100 gradient-border-to-white dark:gradient-border-to-neutral-500 dark:gradient-border-via-neutral-800 dark:gradient-border-from-neutral-500 shadow-lg shadow-black/10 cursor-pointer bg-linear-to-t from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/80 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-90 align-middle" />
          , or{" "}
          <span className="inline-block gradient-border gradient-border-to-t gradient-border-from-blue-100/90 gradient-border-to-sky-300/40 dark:gradient-border-from-blue-500/10 dark:gradient-border-to-sky-400/25 shadow-lg shadow-blue-500/10 cursor-pointer px-3 py-1 rounded-full bg-linear-to-t from-sky-50 to-blue-100 dark:from-sky-950/80 dark:to-sky-800/30 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 align-middle text-sky-950 dark:text-sky-100">
            Colorful Pills
          </span>{" "}
          - perfect for glassy, Liquid Glass-style reflections in your borders.
        </p>

        {/* Configurator */}
        <GradientConfigurator />

        {/* Install */}
        <div className="w-full space-y-3">
          <h2 className="font-medium leading-tight">Install</h2>
          <div className="flex items-center gap-3">
            {INSTALL_COMMANDS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPm(i)}
                className={cn(
                  "text-sm cursor-pointer font-medium transition-colors",
                  pm === i
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-500",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <CodeField code={INSTALL_COMMANDS[pm].command} prefix="$" />
        </div>

        {/* Usage */}
        <div className="w-full space-y-3">
          <h2 className="font-medium leading-tight">Usage</h2>
          <div>
            <h3 className="text-sm mb-1.5 leading-tight text-neutral-400">Tailwind stylesheet</h3>
            <CodeField code="@import 'gradient-border-plugin';" />
          </div>
          <div>
            <h3 className="text-sm mb-1.5 leading-tight text-neutral-400">Element classes</h3>
            <CodeField code="<div className='gradient-border gradient-border-to-r gradient-border-from-blue-500 gradient-border-to-pink-300 rounded-lg' />" />
          </div>
          <div>
            <h3 className="text-sm mb-1.5 leading-tight text-neutral-400">Width variants</h3>
            <CodeField code="<div className='gradient-border-2 gradient-border-to-r gradient-border-from-blue-500 gradient-border-to-pink-300 rounded-lg' />" />
          </div>
          <div>
            <h3 className="text-sm mb-1.5 leading-tight text-neutral-400">With a middle color</h3>
            <CodeField code="<div className='gradient-border gradient-border-to-r gradient-border-from-indigo-500 gradient-border-via-purple-500 gradient-border-to-pink-500 rounded-lg' />" />
          </div>
          <div>
            <h3 className="text-sm mb-1.5 leading-tight text-neutral-400">
              Full gradient override
            </h3>
            <CodeField code="<div className='gradient-border [--gradient-border:conic-gradient(from_90deg,red,blue,red)]' />" />
          </div>
        </div>

        <p className="text-sm text-neutral-400 pt-4">
          Created by{" "}
          <a
            href="https://x.com/flornkm"
            target="_blank"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Florian Kiem
          </a>
        </p>
      </div>
    </main>
  );
}

export default App;
