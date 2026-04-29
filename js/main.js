import { state } from "./constants.js";
import {
  loadBookmarks,
  exportBookmarks,
  importBookmarks,
  resetBookmarks,
  saveToLocalStorage,
  editImage,
  exportImages,
  importImages,
  resetImages,
} from "./storage.js";
import { renderBookmarks } from "./render.js";
import {
  toggleEditMode,
  addCategory,
  renameCategory,
  deleteCategory,
  addLink,
  editLink,
  deleteLink,
} from "./crud.js";
import { dragStart, dragOver, dragLeave, drop } from "./drag.js";

export function toggleSettingsMenu() {
  const menu = document.getElementById("settings-menu");
  menu.classList.toggle("hidden");
}

export function toggleAutoSave() {
  state.autoSaveEnabled = document.getElementById("auto-save-toggle").checked;
  localStorage.setItem(
    "autoSaveEnabled",
    JSON.stringify(state.autoSaveEnabled),
  );
}

window.toggleSettingsMenu = toggleSettingsMenu;
window.exportBookmarks = exportBookmarks;
window.importBookmarks = importBookmarks;
window.resetBookmarks = resetBookmarks;
window.toggleAutoSave = toggleAutoSave;
window.toggleEditMode = toggleEditMode;
window.addCategory = addCategory;
window.renameCategory = renameCategory;
window.deleteCategory = deleteCategory;
window.addLink = addLink;
window.editLink = editLink;
window.deleteLink = deleteLink;
window.dragStart = dragStart;
window.dragOver = dragOver;
window.dragLeave = dragLeave;
window.drop = drop;
window.editImage = editImage;
window.exportImages = exportImages;
window.importImages = importImages;
window.resetImages = resetImages;

document.addEventListener("click", (e) => {
  const menu = document.getElementById("settings-menu");
  const btn = e.target.closest("button[title='Settings']");
  if (!btn && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadBookmarks();
});
