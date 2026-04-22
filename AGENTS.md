# Agent Instructions for Stary

## Project Overview
**Stary** is a simple, customizable static start page (bookmark home). It's a vanilla HTML/CSS/JS project with Tailwind CSS styling and no build step for production.

## Architecture & Layout
```
stary/
├── index.html          # Single page entry point
├── js/script.js        # Loads bookmarks from JSON, renders nav
├── css/
│   ├── style.css       # Tailwind @import + custom theme variables
│   └── tailwind.css    # Pre-built Tailwind CSS (v4.2.2, generated)
├── bookmarks.json      # Data: categories/links structure
├── assets/             # Images: dark.jpg (dark mode), light.jpg (light mode), favicon.ico
└── package.json        # Prettier + Tailwind tooling (no runtime deps)
```

## Key Developer Commands
| Command | Purpose |
|---------|---------|
| `npm install` | Install dev dependencies (Prettier, Tailwind CLI) |
| `npm run format` | NOT PRESENT—use `npx prettier --write` manually |
| `npx prettier --write .` | Format HTML, JSON, CSS with Tailwind plugin |
| `npx tailwindcss -i ./css/style.css -o ./css/tailwind.css --watch` | Rebuild Tailwind CSS on style.css changes |

## Important Details for Agents

### Tailwind CSS Build
- `css/style.css` is the **source** (has `@import "tailwindcss"` and custom `@theme`)
- `css/tailwind.css` is the **compiled output**—do not edit directly
- Run Tailwind CLI whenever `style.css` changes, or after adding new Tailwind classes in HTML
- The generated `tailwind.css` is committed to git (no build step needed for users)

### Code Generation & Formatting
- Prettier is configured with `prettier-plugin-tailwindcss` (sorts Tailwind classes in HTML)
- `.prettierrc` specifies `tailwindStylesheet: ./css/tailwind.css` for plugin configuration
- Always run Prettier after editing HTML to keep class order consistent

### Bookmarks Data Structure
- `bookmarks.json` is an array of category objects:
  ```json
  [{
    "category": "Group Name",
    "links": [
      { "name": "Link Label", "url": "https://..." }
    ]
  }, ...]
  ```
- `js/script.js` uses `fetch("./bookmarks.json")` → maps to DOM id `#bookmark-list`
- No client-side validation; invalid JSON will silently fail with console error

### Dark Mode & Responsive Design
- Dark mode uses CSS media query: `prefers-color-scheme: dark` (system preference)
- Responsive breakpoints:
  - `md:` = 48rem (768px) breakpoints: images, padding, layout
  - `lg:` = 64rem (1024px) breakpoint: additional padding
- Custom Tailwind theme in `style.css`: `--font-serif`, `--font-sans`, mauve/red color palette

### Assets & Customization
- Light mode image: `assets/light.jpg` (shown by default)
- Dark mode image: `assets/dark.jpg` (shown when system prefers dark)
- Favicon: `assets/favicon.ico`
- No build step: users only fork repo and modify JSON/images/CSS

## Common Pitfalls
1. **Editing `tailwind.css` directly** → changes will be lost on next build. Edit `style.css` instead.
2. **Forgetting to rebuild Tailwind** after adding new utility classes in HTML → classes won't have styles.
3. **Not running Prettier after HTML changes** → Tailwind classes won't be sorted, causing inconsistency.
4. **Breaking bookmarks.json structure** → `script.js` expects exact schema; missing fields silently fail.
5. **Committing changes without rebuilding Tailwind** → downstream users get broken styles.

## Testing & Verification
- No automated tests (none configured in package.json)
- Manual verification:
  - Open `index.html` in browser (file:// protocol works)
  - Check light/dark mode switching (system settings)
  - Verify bookmarks load from JSON (check browser console for errors)
  - Test responsive layout at md/lg breakpoints
