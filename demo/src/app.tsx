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
    <main className="min-h-screen px-4 pt-4 pb-8 md:py-20">
      <div className="w-full max-w-3xl flex space-y-8 flex-col items-start mx-auto">
        <div className="space-y-2">
          <h1 className="text-base font-medium leading-tight">Gradient Border Plugin</h1>
          <p className="text-sm mb-1.5 leading-tight text-neutral-400">
            A simple Tailwind plugin for beautiful gradient borders using mask-composite.
          </p>
        </div>

        <p className="text-base">
          With regular CSS borders you only get one color per side, so they meet at hard corners
          and never actually blend, like{" "}
          <span className="inline-block mx-0.5 border-2 border-t-blue-400 border-r-pink-400 border-b-blue-400 border-l-pink-400 px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-900 align-middle text-sm">
            this
          </span>
          . This plugin draws a real gradient across the whole border, so you can build things like{" "}
          <span className="inline-block gradient-border gradient-border-to-t gradient-border-from-white gradient-border-to-neutral-200 dark:gradient-border-to-neutral-700 dark:gradient-border-from-neutral-700/20 shadow-lg shadow-black/5 cursor-pointer px-3 py-1 rounded-full bg-linear-to-t from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-800/80 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 align-middle">
            this
          </span>
          ,{" "}
          <span className="inline-block size-8 rounded-full gradient-border gradient-border-to-tl gradient-border-from-white gradient-border-via-neutral-100 gradient-border-to-white dark:gradient-border-to-neutral-500 dark:gradient-border-via-neutral-800 dark:gradient-border-from-neutral-500 shadow-lg shadow-black/10 cursor-pointer bg-linear-to-t from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/80 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-90 align-middle" />
          , or{" "}
          <span className="inline-block gradient-border gradient-border-to-t gradient-border-from-blue-100/90 gradient-border-to-sky-300/40 dark:gradient-border-from-blue-500/10 dark:gradient-border-to-sky-400/25 shadow-lg shadow-blue-500/10 cursor-pointer px-3 py-1 rounded-full bg-linear-to-t from-sky-50 to-blue-100 dark:from-sky-950/80 dark:to-sky-800/30 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-105 active:scale-95 align-middle text-sky-950 dark:text-sky-100">
            this
          </span>
          .
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

        <article className="w-full pt-8 mt-4 border-t border-neutral-200 dark:border-neutral-800 prose prose-sm dark:prose-invert max-w-none [&_h2]:font-medium [&_h2]:text-base [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-medium [&_h3]:text-sm [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-neutral-500 [&_p]:dark:text-neutral-400 [&_p]:leading-relaxed [&_li]:text-sm [&_li]:text-neutral-500 [&_li]:dark:text-neutral-400 [&_code]:text-xs [&_code]:bg-neutral-100 [&_code]:dark:bg-neutral-900 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
          <h2>About the Gradient Border Plugin</h2>
          <p>
            The Gradient Border Plugin is a tiny CSS-only Tailwind CSS plugin that lets you draw a
            real gradient stroke around any element. It uses the modern <code>mask-composite</code>{" "}
            technique so the gradient flows continuously around the entire perimeter and follows
            whatever <code>border-radius</code> the element already has, rounded corners, pills,
            circles, or squircles included.
          </p>

          <h2>Why use it</h2>
          <p>
            Standard CSS borders can only be assigned one color per side, which creates hard
            transitions at corners. Background-clip tricks work for fills but not for outlines.
            This plugin gives you a real gradient outline with a single class, and the API mirrors
            Tailwind&rsquo;s built-in gradient utilities so it feels native.
          </p>

          <h2>Features</h2>
          <ul>
            <li>One base utility (<code>gradient-border</code>) plus four width variants from 1px to 4px</li>
            <li>Direction utilities matching Tailwind&rsquo;s <code>bg-linear-to-*</code> set</li>
            <li>Color stop utilities (<code>gradient-border-from-*</code>, <code>-via-*</code>, <code>-to-*</code>) with full Tailwind color and alpha support</li>
            <li>Animated <code>animate-gradient-border</code> variant with a configurable duration</li>
            <li>Override <code>--gradient-border</code> directly for conic, radial, or arbitrary CSS gradients</li>
            <li>Pure CSS, no JavaScript, no SVG filters, ships as a single import</li>
          </ul>

          <h2>Common use cases</h2>
          <ul>
            <li>Glass-style buttons and pills with a soft gradient outline</li>
            <li>Liquid Glass and frosted UI accents</li>
            <li>Highlighting active or focused cards</li>
            <li>Animated AI / thinking states (rotating border)</li>
            <li>Branded dividers, avatars, and badges</li>
          </ul>

          <h2>Installation</h2>
          <p>
            Install with <code>npm i gradient-border-plugin</code> (or pnpm / yarn / bun) and import
            it from your Tailwind stylesheet with <code>@import &apos;gradient-border-plugin&apos;</code>. Works
            with Tailwind CSS v4. See the{" "}
            <a
              href="https://github.com/flornkm/gradient-border-plugin"
              target="_blank"
              rel="noopener"
            >
              README on GitHub
            </a>{" "}
            for the full class reference.
          </p>

          <h2>FAQ</h2>
          <h3>Does it work with Tailwind v3?</h3>
          <p>
            The plugin is built for Tailwind CSS v4 using <code>@utility</code> definitions. For v3
            projects, copy the underlying CSS or pin to a v3-compatible fork.
          </p>
          <h3>Does it support dark mode?</h3>
          <p>
            Yes. Use Tailwind&rsquo;s <code>dark:</code> variant on any color stop, e.g.{" "}
            <code>dark:gradient-border-from-neutral-700</code>.
          </p>
          <h3>Can I animate the gradient?</h3>
          <p>
            Yes. Add <code>animate-gradient-border</code> to rotate the gradient angle continuously
            and override <code>--gradient-border-duration</code> to control the speed.
          </p>
          <h3>Is it accessible?</h3>
          <p>
            Yes. The effect is purely visual via a <code>::before</code> pseudo-element with{" "}
            <code>pointer-events: none</code>, so it never interferes with focus, hit-testing, or
            screen readers.
          </p>
        </article>

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
