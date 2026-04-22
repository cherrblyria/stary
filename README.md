## ✨ Stary

A customizable static start page with editable bookmarks. Lightweight, no build step required—just pure HTML, CSS, and JavaScript with Tailwind styling.

**👉🏻 [Live Preview](https://cherrblyria.github.io/stary/)**

### Features

- **Editable Bookmarks** – Add, edit, delete, and organize bookmarks by category
- **Persistent Storage** – Bookmarks saved to browser localStorage with JSON export/import
- **Dark/Light Mode** – System preference detection with automatic theming
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile
- **No Build Required** – Open `index.html` in your browser and start using immediately

### Quick Start

1. **Fork or clone** this repository
2. **Open** `index.html` in your browser
3. **Click the ⚙️ settings button** to customize bookmarks, toggle dark mode, and export/import data

### Customization

#### Bookmarks
Edit `bookmarks.json` to set default bookmarks, or use the in-app settings menu to manage them directly.

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
