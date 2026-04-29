import { state } from './constants.js';
import { saveToLocalStorage } from './storage.js';
import { renderBookmarks } from './render.js';

let draggedItem = null;
let draggedGroupIndex = null;
let draggedLinkIndex = null;

export function dragStart(e) {
  if (!state.editMode) return;
  
  let target = e.target.closest('[draggable="true"]');
  if (!target) return;
  
  draggedItem = target;
  
  if (target.hasAttribute('data-link-index')) {
    draggedGroupIndex = parseInt(target.getAttribute('data-group-index'));
    draggedLinkIndex = parseInt(target.getAttribute('data-link-index'));
    e.dataTransfer.setData('text/plain', 'link');
  } else {
    draggedGroupIndex = parseInt(target.getAttribute('data-group-index'));
    draggedLinkIndex = null;
    e.dataTransfer.setData('text/plain', 'group');
  }
  
  setTimeout(() => { target.style.opacity = '0.5'; }, 0);
}

export function dragOver(e) {
  if (!state.editMode) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.target.closest('[draggable="true"]') || e.target.closest('[data-group-index]');
  if (!target || (draggedItem && target === draggedItem)) return;
  
  target.classList.add(...['border-2', 'border-dashed', 'border-blue-500']);
}

export function dragLeave(e) {
  if (!state.editMode) return;
  const target = e.target.closest('[draggable="true"]') || e.target.closest('[data-group-index]');
  if (target) {
    target.classList.remove(...['border-2', 'border-dashed', 'border-blue-500']);
  }
}

export function drop(e) {
  if (!state.editMode) return;
  e.preventDefault();
  
  const target = e.target.closest('[draggable="true"]') || e.target.closest('[data-group-index]');
  
  if (!target || (draggedItem && target === draggedItem)) {
    clearDropHighlights();
    return;
  }
  
  clearDropHighlights();
  
  const targetGroupIndex = parseInt(target.getAttribute('data-group-index'));
  const targetLinkIndex = target.hasAttribute('data-link-index') 
    ? parseInt(target.getAttribute('data-link-index')) 
    : null;
  
  const dragType = e.dataTransfer.getData('text/plain');
  const bookmarks = state.bookmarks;
  
  if (dragType === 'group' && targetGroupIndex !== draggedGroupIndex) {
    const [moved] = bookmarks.splice(draggedGroupIndex, 1);
    bookmarks.splice(targetGroupIndex, 0, moved);
    saveToLocalStorage();
    renderBookmarks();
  } else if (dragType === 'link' && draggedGroupIndex === targetGroupIndex && targetLinkIndex !== null) {
    const [moved] = bookmarks[draggedGroupIndex].links.splice(draggedLinkIndex, 1);
    bookmarks[draggedGroupIndex].links.splice(targetLinkIndex, 0, moved);
    saveToLocalStorage();
    renderBookmarks();
  } else if (dragType === 'link' && targetLinkIndex === null) {
    const [moved] = bookmarks[draggedGroupIndex].links.splice(draggedLinkIndex, 1);
    bookmarks[targetGroupIndex].links.push(moved);
    saveToLocalStorage();
    renderBookmarks();
  }
  
  if (draggedItem) draggedItem.style.opacity = '1';
  draggedItem = null;
  draggedGroupIndex = null;
  draggedLinkIndex = null;
}

function clearDropHighlights() {
  document.querySelectorAll('[draggable="true"]').forEach(el => {
    el.classList.remove(...['border-2', 'border-dashed', 'border-blue-500']);
  });
}