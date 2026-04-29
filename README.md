## ✨ Stary

A customizable static start page with editable bookmarks. Lightweight, no build step required—just pure HTML, CSS, and JavaScript with Tailwind CSS v4.

**👉🏻 [Live Preview](https://cherrblyria.github.io/stary/)**

### Features

- **Editable Bookmarks** – Add, edit, delete, and organize bookmarks by category
- **Persistent Storage** – Bookmarks saved to browser localStorage with JSON export/import
- **Dark/Light Mode** – System preference detection with automatic theming
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile
- **No Build Required** – Just deploy static files, or use the live demo

### Quick Start

1. **Use the live demo** at https://cherrblyria.github.io/stary/
2. **Or deploy locally** - serve this directory with any static server (e.g., `npx serve` or VS Code Live Server)
3. **Click the ⚙️ settings button** to customize bookmarks, toggle dark mode, and export/import data

Note: Opening `index.html` directly in the browser won't work—JavaScript is blocked by CORS policies when run from the file system.

### Customization

#### Bookmarks
Defaults are defined in `js/script.js` (variable `defaultBookmarks`). Use the in-app settings menu to manage bookmarks.

#### Appearance
- **Background Images:** Replace images in `assets/` (square images recommended)
  - Dark Mode: `assets/dark.jpg`
  - Light Mode: `assets/light.jpg`
- **Fonts & Colors:** Modify `css/style.css` (Tailwind CSS with custom theme)
- **Layout & HTML:** Edit `index.html` for structural changes

#### Development

Install dependencies and rebuild Tailwind CSS after making style changes:

```bash
npm install
npx @tailwindcss/cli -i ./css/style.css -o ./css/tailwind.css
```

**Note:** Always rebuild Tailwind CSS when adding new utility classes—never edit `css/tailwind.css` directly.

**Formatting:** Run `npx prettier --write .` to format HTML/JS and auto-sort Tailwind classes.
