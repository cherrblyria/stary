import { state, defaultSettings } from "./constants.js";
import { renderBookmarks } from "./render.js";

export function saveImages() {
  if (!state.autoSaveEnabled) {
    console.log("Auto-save disabled, use Export to save changes");
    return;
  }
  localStorage.setItem("images", JSON.stringify(state.images));
}

export function loadImages() {
  const saved = localStorage.getItem("images");
  if (saved !== null) {
    state.images = JSON.parse(saved);
  } else {
    state.images = JSON.parse(JSON.stringify(defaultSettings.images));
  }
  updateImageSrcs();
}

export function updateImageSrcs() {
  const picture = document.querySelector("picture");
  const source = picture?.querySelector("source");
  const img = picture?.querySelector("img");
  console.log("[updateImageSrcs] Updating images:", state.images);
  console.log("[updateImageSrcs] source element:", source, "img element:", img);
  if (source) {
    source.srcset = state.images.dark;
    console.log(
      "[updateImageSrcs] Updated source.srcset to:",
      state.images.dark,
    );
  }
  if (img) {
    img.src = state.images.light;
    console.log("[updateImageSrcs] Updated img.src to:", state.images.light);
  }
}

export function saveToLocalStorage() {
  if (!state.autoSaveEnabled) {
    console.log("Auto-save disabled, use Export to save changes");
    return;
  }
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
  localStorage.setItem("images", JSON.stringify(state.images));
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
    loadImages();
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      state.bookmarks = JSON.parse(stored);
    } else {
      state.bookmarks = JSON.parse(JSON.stringify(defaultSettings.bookmarks));
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
        if (
          Array.isArray(imported) &&
          imported.every((item) => item.category && Array.isArray(item.links))
        ) {
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
  if (
    confirm("Reset bookmarks to default? This will clear any local changes.")
  ) {
    localStorage.removeItem("bookmarks");
    state.bookmarks = JSON.parse(JSON.stringify(defaultSettings.bookmarks));
    saveToLocalStorage();
    renderBookmarks();
  }
}

export function editImage(theme) {
  console.log("[editImage] Starting image edit for theme:", theme);
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  document.body.appendChild(input);
  input.onchange = (e) => {
    console.log("[editImage] onchange triggered, files:", e.target.files);
    const file = e.target.files[0];
    if (file) {
      console.log("[editImage] File selected:", file.name, file.type);
      const url = URL.createObjectURL(file);
      console.log("[editImage] Created Object URL:", url);
      state.images[theme] = url;
      console.log("[editImage] Updated state.images:", state.images);
      saveImages();
      updateImageSrcs();
      console.log("[editImage] Image updated successfully");
    } else {
      console.log("[editImage] No file selected");
    }
    document.body.removeChild(input);
  };
  input.click();
}

export function exportImages() {
  const dataStr = JSON.stringify(state.images, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "stary-images.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function importImages() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.light && imported.dark) {
          state.images = imported;
          saveImages();
          updateImageSrcs();
          alert("Images imported successfully!");
        } else {
          alert("Invalid images format!");
        }
      } catch (err) {
        alert("Error parsing file: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export function resetImages() {
  if (confirm("Reset images to default? This will clear any custom images.")) {
    localStorage.removeItem("images");
    state.images = JSON.parse(JSON.stringify(defaultSettings.images));
    saveImages();
    updateImageSrcs();
  }
}
