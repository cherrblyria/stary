# Agent Instructions for Stary

## Project Overview

**Stary** is a customizable static start page with editable bookmarks. Vanilla HTML/CSS/JS with Tailwind CSS, no production build step. Bookmarks and settings persist to browser localStorage; changes sync with JSON export/import.

## Architecture & Layout

```
stary/
├── index.html          # Single page; settings menu button + bookmark render target
├── js/script.js        # Bookmark management (CRUD), localStorage, settings menu, edit mode UI
├── css/
│   ├── style.css       # Tailwind @import + custom fonts (source for Tailwind build)
│   └── tailwind.css    # Compiled CSS (generated—do not edit)
├── bookmarks.json      # Default bookmarks data (fallback if localStorage empty)
├── assets/             # light.jpg, dark.jpg, favicon.ico
└── package.json        # Dev deps: Prettier, Tailwind CLI, @tailwindcss/cli
```

## Key Developer Commands

| Command                                                         | Purpose                                                                                   |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `npm install`                                                   | Install dev dependencies                                                                  |
| `npx @tailwindcss/cli -i ./css/style.css -o ./css/tailwind.css` | Rebuild compiled CSS after style.css changes                                              |
| Prettier                                                        | Not in npm scripts; use manually if needed (has `prettier-plugin-tailwindcss` configured) |

**Critical:** Always rebuild Tailwind after HTML changes introduce new utility classes (blue, green, red, purple, yellow, etc.).

## Bookmark Features (as of v1.1)

- **Storage:** Default bookmarks from `bookmarks.json`; first load saves to localStorage
- **Edit mode:** Toggle via settings menu → "Edit Bookmarks" button shows add/delete/edit controls inline
- **Data persistence:** Auto-save to localStorage (controlled by "Auto-save enabled" toggle in settings)
- **Export/Import:** Download bookmarks as JSON or import previously exported file
- **Reset:** Clear localStorage and reload default `bookmarks.json`

### Bookmarks Data Flow

1. **Load:** localStorage.getItem("bookmarks") → fallback to fetch("./bookmarks.json")
2. **Save:** saveToLocalStorage() checks `autoSaveEnabled` before writing (silent no-op if false)
3. **Render:** renderBookmarks() generates HTML with inline edit/delete buttons when `editMode === true`
4. **Schema:** Array of `{category, links: [{name, url}, ...]}` (no client-side validation; invalid JSON fails silently to console)

## Settings Menu

- Button: ⚙️ emoji (fixed bottom-right, no background, `text-xl`)
- Menu: appears above button (`fixed bottom-16 right-4`), closes on click-outside
- Sections:
  - **Settings:** Auto-save toggle (persists as `localStorage.autoSaveEnabled`)
  - **Bookmarks:** Edit toggle + Add Category
  - **Data:** Export, Import, Reset to Default

Edit mode toggle changes button text ("Edit Bookmarks" ↔ "Done Editing") and must preserve `w-full px-3 py-2 text-sm` to avoid layout shift.

## Tailwind CSS Build

- **Source:** `css/style.css` (imports tailwindcss, defines `@theme` with custom fonts)
- **Output:** `css/tailwind.css` (committed to git; compiled by CLI)
- **Workflow:** Edit `style.css` or HTML → run Tailwind CLI → commit both
- **Command:** `npx @tailwindcss/cli -i ./css/style.css -o ./css/tailwind.css` (use cmd /c on Windows PowerShell due to execution policy)
- **Do NOT edit `tailwind.css` directly** — changes lost on rebuild

## Dark Mode & Responsive Design

- Dark mode: CSS media query `prefers-color-scheme: dark` (system preference)
- Breakpoints: `md:` (768px) and `lg:` (1024px) for images, padding, layout
- Theme: Mauve (primary) + Red (accent) + standard Tailwind colors (Blue, Green, Yellow, Purple for buttons)

## Common Pitfalls

1. **Edited `tailwind.css` directly** → lost on next CLI run; always edit `style.css`
2. **Forgot to rebuild Tailwind** after adding utility classes → styles missing
3. **Edit Bookmarks button changed size on toggle** → must keep `w-full px-3 py-2 text-sm` in both states
4. **Invalid bookmarks.json** → silently fails; check browser console for parse errors
5. **Committed without rebuilding Tailwind** → users get unstyled content

## Testing

- No unit/integration tests configured
- Manual: Open `index.html` in browser, verify bookmarks load from localStorage/JSON, test edit/add/delete/export/import/reset flows, check light/dark modes and responsive breakpoints
