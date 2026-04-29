<img src="https://gradient-border.floriankiem.com/images/opengraph.webp" alt="Gradient Border Plugin" />

# Gradient Border Plugin

A simple Tailwind plugin that adds beautiful gradient borders to your elements.

## Install

```bash
npm i gradient-border-plugin
```

## Usage

### Tailwind stylesheet

```css
@import 'gradient-border-plugin';
```

### Element classes

The API mirrors Tailwind's built-in gradient utilities — just prefix with `gradient-border`:

```html
<div class="gradient-border gradient-border-to-r gradient-border-from-blue-500 gradient-border-to-pink-300 rounded-lg" />
```

### Width variants

```html
<div class="gradient-border-2 gradient-border-to-r gradient-border-from-blue-500 gradient-border-to-pink-300 rounded-lg" />
```

### With a middle color

```html
<div class="gradient-border gradient-border-to-r gradient-border-from-indigo-500 gradient-border-via-purple-500 gradient-border-to-pink-500 rounded-lg" />
```

### Full gradient override

For complex gradients (conic, radial, etc.), set the CSS variable directly:

```html
<div class="gradient-border [--gradient-border:conic-gradient(from_90deg,red,blue,red)]" />
```

### Alpha modifiers

Color stops accept Tailwind-style alpha modifiers:

```html
<div class="gradient-border gradient-border-from-blue-500/50 gradient-border-to-pink-300/20" />
```

### Animation

Add `animate-gradient-border` to rotate the gradient angle continuously. Pairs with any combination of `from`/`via`/`to` colors:

```html
<div class="gradient-border-2 animate-gradient-border gradient-border-from-indigo-500 gradient-border-via-purple-500 gradient-border-to-pink-500 rounded-lg" />
```

Override the speed with `--gradient-border-duration` (defaults to `4s`):

```html
<div class="gradient-border animate-gradient-border [--gradient-border-duration:2s]" />
```

## Available classes

### Base & width

| Class | Purpose |
|-------|---------|
| `gradient-border` | 1px gradient border (default) |
| `gradient-border-2` | 2px gradient border |
| `gradient-border-3` | 3px gradient border |
| `gradient-border-4` | 4px gradient border |
| `gradient-border-none` | Remove gradient border |
| `animate-gradient-border` | Rotate the gradient angle continuously |

### Direction (mirrors `bg-linear-to-*`)

| Class | Direction |
|-------|-----------|
| `gradient-border-to-t` | To top |
| `gradient-border-to-tr` | To top right |
| `gradient-border-to-r` | To right |
| `gradient-border-to-br` | To bottom right |
| `gradient-border-to-b` | To bottom (default) |
| `gradient-border-to-bl` | To bottom left |
| `gradient-border-to-l` | To left |
| `gradient-border-to-tl` | To top left |

### Color stops (mirrors `from-*`, `via-*`, `to-*`)

| Class | Purpose |
|-------|---------|
| `gradient-border-from-{color}` | Start color |
| `gradient-border-via-{color}` | Middle color |
| `gradient-border-to-{color}` | End color |

## CSS Variables

| Variable | Default |
|----------|---------|
| `--gradient-border` | Composed from `from`/`to`/`via` |
| `--gradient-border-width` | `1px` |
| `--gradient-border-angle` | `to bottom` |
| `--gradient-border-from` | `rgba(0, 0, 0, 0.15)` |
| `--gradient-border-to` | `transparent` |
| `--gradient-border-via` | *(auto midpoint)* |
| `--gradient-border-duration` | `4s` (used by `animate-gradient-border`) |

## Tailwind v4 theme customization

Add custom border widths:

```css
@theme {
  --gradient-border-width-5: 5px;
  --gradient-border-width-6: 6px;
}
```

## License

MIT

Created by [Florian Kiem](https://x.com/flornkm).
