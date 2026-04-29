# Stary

Static start page. Vanilla HTML/CSS/JS + Tailwind CSS (v4). Bookmarks persist to localStorage.

## Layout

```
index.html          # Page + settings button
js/script.js       # Bookmark CRUD, localStorage, settings menu
css/style.css      # Tailwind source (edit here)
css/tailwind.css   # Compiled CSS (generated—do not edit)
bookmarks.json    # (deprecated) Defaults now in js/script.js
assets/            # background images, favicon
package.json      # Dev: prettier, @tailwindcss/cli, tailwindcss
```

## Commands

```bash
npm install
npx @tailwindcss/cli -i ./css/style.css -o ./css/tailwind.css
```

**Rebuild Tailwind after editing `css/style.css` or adding utility classes in HTML.** Never edit `tailwind.css` directly.

**Formatting:** Run `npx prettier --write .` to format HTML/JS and auto-sort Tailwind classes.

## Data Flow

1. **Load:** localStorage → fallback to built-in defaults in `js/script.js`
2. **Save:** `saveToLocalStorage()` checks `autoSaveEnabled` (silent if disabled)
3. **Schema:** `[{category, links: [{name, url}, ...]}, ...]`

## Settings Menu

- Button: ⚙️ (fixed bottom-right)
- Menu: `fixed bottom-16 right-4`
- Sections: Settings → Auto-save | Bookmarks → Edit toggle + Add Category | Data → Export, Import, Reset

Edit mode button uses `w-full px-3 py-2 text-sm` in both states (blue/green) to avoid layout shift.

## Git

Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.

## Pitfalls

1. Edit `tailwind.css` directly → lost on rebuild
2. Forget to rebuild Tailwind → styles missing
3. Button class changes on edit toggle → layout shift
4. Invalid external bookmarks file → previously could silently fail; defaults are now in-code, see `js/script.js` if you need to change them
5. Commit without rebuilding → users get unstyled content (run Tailwind CLI before commit)
