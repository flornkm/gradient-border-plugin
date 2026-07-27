import { useState } from "react";
import { ThemeToggle } from "./components/theme-toggle";
import { useTheme } from "./utils/theme";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils/cn";
import { detectLanguage, highlight } from "./utils/highlight";
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
        <pre className="tabular-nums font-normal text-sm whitespace-pre overflow-x-auto scrollbar-none text-neutral-600 dark:text-neutral-300">
          {prefix && <span className="text-neutral-300 dark:text-neutral-600 mr-2">{prefix}</span>}
          {highlight(code, detectLanguage(code))}
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
  const { theme, resolved, setTheme } = useTheme();
  const [pm, setPm] = useState(0);

  return (
    <main className="min-h-screen px-4 pt-4 pb-8 md:py-20">
      <div className="w-full max-w-3xl flex space-y-8 flex-col items-start mx-auto">
        <div className="w-full flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-base font-medium leading-tight">Gradient Border Plugin</h1>
            <p className="text-sm mb-1.5 leading-tight text-neutral-400">
              A simple Tailwind plugin for beautiful gradient borders using mask-composite.
            </p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>

        {/* Configurator */}
        <GradientConfigurator theme={resolved} />

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
        <div className="w-full space-y-6">
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

        <a
          href="https://github.com/flornkm/gradient-border-plugin"
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 gradient-border gradient-border-to-t gradient-border-from-white gradient-border-to-neutral-200 dark:gradient-border-from-neutral-700/20 dark:gradient-border-to-neutral-700 shadow-lg shadow-black/5 cursor-pointer px-3.5 py-1.5 rounded-full bg-linear-to-t from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-800/80 text-sm font-medium text-neutral-900 dark:text-neutral-100 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>Star on GitHub</span>
        </a>

        <p className="text-sm text-neutral-400 pt-4">
          Created by{" "}
          <a
            href="https://x.com/flornkm"
            target="_blank"
            className="text-neutral-500 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Florian Kiem
          </a>
        </p>
      </div>
    </main>
  );
}

export default App;
