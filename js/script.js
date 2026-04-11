async function loadBookmarks() {
  try {
    // Fetch the data from your JSON file
    const response = await fetch('./bookmarks.json');
    const data = await response.json();
    
    const container = document.getElementById('bookmark-list');

    // Map through categories and links
    const html = data.map(group => `
      <div>
        <div class="font-extrabold">${group.category}</div>
        <div class="flex flex-col">
          ${group.links.map(link => `
            <a href="${link.url}" class="hover:underline">${link.name}</a>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Inject the generated HTML into the nav
    container.innerHTML = html;
  } catch (err) {
    console.error("Oops, couldn't load links!", err);
  }
}

loadBookmarks();