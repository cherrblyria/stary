import { state } from './constants.js';
import { saveToLocalStorage } from './storage.js';
import { renderBookmarks } from './render.js';

export function toggleEditMode() {
  state.editMode = !state.editMode;
  const btn = document.getElementById("edit-btn");
  btn.textContent = state.editMode ? "Done Editing" : "Edit Bookmarks";
  btn.className = state.editMode
    ? "w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold text-sm"
    : "w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm";
  renderBookmarks();
}

export function addCategory() {
  const name = prompt("Enter category name:");
  if (name) {
    state.bookmarks.push({ category: name, links: [] });
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function renameCategory(index) {
  const newName = prompt("Rename category:", state.bookmarks[index].category);
  if (newName && newName !== state.bookmarks[index].category) {
    state.bookmarks[index].category = newName;
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function deleteCategory(index) {
  if (confirm(`Delete "${state.bookmarks[index].category}"?`)) {
    state.bookmarks.splice(index, 1);
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function addLink(groupIndex) {
  const name = prompt("Enter link name:");
  if (!name) return;
  const url = prompt("Enter URL:");
  if (url) {
    state.bookmarks[groupIndex].links.push({ name, url });
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function editLink(groupIndex, linkIndex) {
  const link = state.bookmarks[groupIndex].links[linkIndex];
  const name = prompt("Edit link name:", link.name);
  if (name === null) return;
  const url = prompt("Edit URL:", link.url);
  if (url) {
    state.bookmarks[groupIndex].links[linkIndex] = { name, url };
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function deleteLink(groupIndex, linkIndex) {
  state.bookmarks[groupIndex].links.splice(linkIndex, 1);
  saveToLocalStorage();
  renderBookmarks();
}