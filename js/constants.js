export const defaultSettings = {
  bookmarks: [
    {
      category: "Search",
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "DuckDuckGo", url: "https://duckduckgo.com" }
      ]
    },
    {
      category: "Development",
      links: [
        { name: "GitHub", url: "https://github.com" },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
        { name: "Stack Overflow", url: "https://stackoverflow.com" }
      ]
    },
    {
      category: "Productivity",
      links: [
        { name: "Wikipedia", url: "https://wikipedia.org" },
        { name: "Wolfram Alpha", url: "https://wolframalpha.com" }
      ]
    },
    {
      category: "Entertainment",
      links: [
        { name: "YouTube", url: "https://youtube.com" }
      ]
    }
  ],
  images: {
    light: "./assets/light.jpg",
    dark: "./assets/dark.jpg"
  }
};

export const state = {
  bookmarks: [],
  images: { light: "./assets/light.jpg", dark: "./assets/dark.jpg" },
  editMode: false,
  autoSaveEnabled: true
};