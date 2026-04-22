let bookmarks = [];
let editMode = false;
let autoSaveEnabled = true;

// Toggle settings menu visibility
function toggleSettingsMenu() {
  const menu = document.getElementById("settings-menu");
  menu.classList.toggle("hidden");
}

// Close settings menu when clicking outside
document.addEventListener("click", (e) => {
  const menu = document.getElementById("settings-menu");
  const btn = e.target.closest("button[title='Settings']");
  if (!btn && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Toggle auto-save setting
function toggleAutoSave() {
  autoSaveEnabled = document.getElementById("auto-save-toggle").checked;
  localStorage.setItem("autoSaveEnabled", JSON.stringify(autoSaveEnabled));
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem("autoSaveEnabled");
  if (saved !== null) {
    autoSaveEnabled = JSON.parse(saved);
  }
  if (document.getElementById("auto-save-toggle")) {
    document.getElementById("auto-save-toggle").checked = autoSaveEnabled;
  }
}

// Load bookmarks from localStorage or fallback to JSON
async function loadBookmarks() {
  try {
    loadSettings();
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      bookmarks = JSON.parse(stored);
    } else {
      // Fallback to default bookmarks.json
      const response = await fetch("./bookmarks.json");
      bookmarks = await response.json();
      saveToLocalStorage();
    }
    renderBookmarks();
  } catch (err) {
    console.error("Oops, couldn't load links!", err);
  }
}

// Save bookmarks to localStorage
function saveToLocalStorage() {
  if (!autoSaveEnabled) {
    console.log("Auto-save disabled, use Export to save changes");
    return;
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Render bookmarks (with edit UI in edit mode)
function renderBookmarks() {
  const container = document.getElementById("bookmark-list");

  const html = bookmarks
    .map(
      (group, groupIndex) => `
    <div class="relative group">
<div class="font-extrabold flex items-center justify-between gap-2">
          <span>${group.category}</span>
          ${editMode ? `<div class="flex gap-2">
            <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="renameCategory(${groupIndex})">Rename</button>
            <button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteCategory(${groupIndex})">Delete</button>
          </div>` : ""}
        </div>
      <div class="flex flex-col">
        ${group.links
          .map(
            (link, linkIndex) => `
          <div class="flex items-center justify-between gap-2 group/link">
            <a href="${link.url}" class="hover:underline flex-grow text-left">${link.name}</a>
            ${editMode ? `<button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="editLink(${groupIndex}, ${linkIndex})">Edit</button><button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteLink(${groupIndex}, ${linkIndex})">Delete</button>` : ""}
          </div>
        `,
          )
          .join("")}
        ${editMode ? `<button class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2" onclick="addLink(${groupIndex})">+ Add Link</button>` : ""}
      </div>
    </div>
  `,
    )
    .join("");

  if (editMode) {
  container.innerHTML = `<div class=\"flex gap-4\">${html}<div class=\"flex flex-col items-start\"><button onclick=\"addCategory()\" class=\"w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold text-sm mt-2\">+ Add Category</button></div></div>`;
} else {
  container.innerHTML = html;
}
}

// Toggle edit mode
function toggleEditMode() {
  editMode = !editMode;
  document.getElementById("edit-btn").textContent = editMode ? "Done Editing" : "Edit Bookmarks";
  document.getElementById("edit-btn").className = editMode
    ? "w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold text-sm"
    : "w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm";
  renderBookmarks();
}

// Add a new category
function addCategory() {
  const name = prompt("Enter category name:");
  if (name) {
    bookmarks.push({ category: name, links: [] });
    saveToLocalStorage();
    renderBookmarks();
  }
}

// Delete a category
function renameCategory(index) {
  const newName = prompt("Rename category:", bookmarks[index].category);
  if (newName && newName !== bookmarks[index].category) {
    bookmarks[index].category = newName;
    saveToLocalStorage();
    renderBookmarks();
  }
}

function deleteCategory(index) {
  if (confirm(`Delete "${bookmarks[index].category}"?`)) {
    bookmarks.splice(index, 1);
    saveToLocalStorage();
    renderBookmarks();
  }
}

// Add a link to a category
function addLink(groupIndex) {
  const name = prompt("Enter link name:");
  if (!name) return;
  const url = prompt("Enter URL:");
  if (url) {
    bookmarks[groupIndex].links.push({ name, url });
    saveToLocalStorage();
    renderBookmarks();
  }
}

// Edit a link
function editLink(groupIndex, linkIndex) {
  const link = bookmarks[groupIndex].links[linkIndex];
  const name = prompt("Edit link name:", link.name);
  if (name === null) return;
  const url = prompt("Edit URL:", link.url);
  if (url) {
    bookmarks[groupIndex].links[linkIndex] = { name, url };
    saveToLocalStorage();
    renderBookmarks();
  }
}

// Delete a link
function deleteLink(groupIndex, linkIndex) {
  bookmarks[groupIndex].links.splice(linkIndex, 1);
  saveToLocalStorage();
  renderBookmarks();
}

// Export bookmarks as JSON
function exportBookmarks() {
  const dataStr = JSON.stringify(bookmarks, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bookmarks.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import bookmarks from JSON
function importBookmarks() {
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
          bookmarks = imported;
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

// Reset to default bookmarks
function resetBookmarks() {
  if (confirm("Reset bookmarks to default? This will clear any local changes.")) {
    localStorage.removeItem("bookmarks");
    location.reload();
  }
}

loadBookmarks();
