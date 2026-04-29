import { state } from './constants.js';

export function renderBookmarks() {
  const container = document.getElementById("bookmark-list");
  const { bookmarks, editMode } = state;

  const html = bookmarks
    .map(
      (group, groupIndex) => `
      <div class="relative group cursor-move" draggable="true" data-group-index="${groupIndex}" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)" ondragleave="dragLeave(event)">
        <div class="font-extrabold flex items-center justify-between gap-2">
          <span>${group.category}</span>
          ${editMode ? `<div class="flex gap-2">
            <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="renameCategory(${groupIndex})">Rename</button>
            <button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteCategory(${groupIndex})">Delete</button>
          </div>` : ""}
        </div>
        <div class="flex flex-col p-2" data-group-index="${groupIndex}" ondragover="dragOver(event)" ondrop="drop(event)" ondragleave="dragLeave(event)">
          ${group.links
            .map(
              (link, linkIndex) => `
            <div class="flex items-center justify-between gap-2 group/link cursor-move" draggable="true" data-group-index="${groupIndex}" data-link-index="${linkIndex}" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)" ondragleave="dragLeave(event)">
              <a href="${link.url}" class="hover:underline flex-grow text-left pointer-events-none">${link.name}</a>
              ${editMode ? `<button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 pointer-events-auto" onclick="event.stopPropagation(); editLink(${groupIndex}, ${linkIndex})">Edit</button><button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 pointer-events-auto" onclick="event.stopPropagation(); deleteLink(${groupIndex}, ${linkIndex})">Delete</button>` : ""}
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
    container.innerHTML = `<div class="flex gap-4">${html}<div class="flex flex-col items-start"><button onclick="addCategory()" class="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold text-sm mt-2">+ Add Category</button></div></div>`;
  } else {
    container.innerHTML = html;
  }
}