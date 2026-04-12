# Gradient Border Plugin Agent Instructions

## Dev environment tips

- Run `npm install gradient-border-plugin` (or your preferred package manager) to add the package to your workspace so Vite, ESLint, and TypeScript can see it
- In the CSS file, which includes `@import "tailwindcss";`, add the following line: `@import "gradient-border-plugin";`

## CSS (tailwind) class instructions

- The API mirrors Tailwind's gradient utilities — prefix everything with `gradient-border`
- Use `gradient-border` for a 1px border, or width variants `gradient-border-2` up to `gradient-border-4`
- Set direction with `gradient-border-to-r`, `gradient-border-to-bl`, etc. (same suffixes as `bg-linear-to-*`)
- Set colors with `gradient-border-from-{color}` and `gradient-border-to-{color}` using Tailwind color tokens
- Optionally add a middle color with `gradient-border-via-{color}`
- For full control, set `--gradient-border` CSS variable to any gradient value
- The element needs `border-radius` via Tailwind's `rounded-*` classes for rounded borders
