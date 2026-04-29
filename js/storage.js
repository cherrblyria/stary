import { state, defaultBookmarks } from './constants.js';
import { renderBookmarks } from './render.js';

export function saveToLocalStorage() {
  if (!state.autoSaveEnabled) {
    console.log("Auto-save disabled, use Export to save changes");
    return;
  }
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function loadSettings() {
  const saved = localStorage.getItem("autoSaveEnabled");
  if (saved !== null) {
    state.autoSaveEnabled = JSON.parse(saved);
  }
  const toggle = document.getElementById("auto-save-toggle");
  if (toggle) toggle.checked = state.autoSaveEnabled;
}

export function loadBookmarks() {
  try {
    loadSettings();
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      state.bookmarks = JSON.parse(stored);
    } else {
      state.bookmarks = JSON.parse(JSON.stringify(defaultBookmarks));
      saveToLocalStorage();
    }
    renderBookmarks();
  } catch (err) {
    console.error("Oops, couldn't load links!", err);
  }
}

export function exportBookmarks() {
  const dataStr = JSON.stringify(state.bookmarks, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "stary-bookmarks.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function importBookmarks() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported) && imported.every(item => item.category && Array.isArray(item.links))) {
          state.bookmarks = imported;
          saveToLocalStorage();
          renderBookmarks();
          alert("Bookmarks imported successfully!");
        } else {
          alert("Invalid bookmarks format!");
        }
      } catch (err) {
        alert("Error parsing file: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export function resetBookmarks() {
  if (confirm("Reset bookmarks to default? This will clear any local changes.")) {
    localStorage.removeItem("bookmarks");
    state.bookmarks = JSON.parse(JSON.stringify(defaultBookmarks));
    saveToLocalStorage();
    renderBookmarks();
  }
}