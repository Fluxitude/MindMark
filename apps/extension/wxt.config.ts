import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "MindMark - AI Bookmark Manager",
    description:
      "AI-enhanced bookmark manager designed for cognitive accessibility",
    version: "0.1.0",
    permissions: ["activeTab", "bookmarks", "storage", "tabs", "contextMenus"],
    host_permissions: ["https://*/*", "http://*/*"],
    action: {
      default_title: "MindMark",
      default_popup: "popup.html",
    },
    content_scripts: [
      {
        matches: ["https://*/*", "http://*/*"],
        js: ["content-scripts/content.js"],
      },
    ],
    background: {
      service_worker: "background.js",
    },
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      96: "icon/96.png",
      128: "icon/128.png",
    },
  },
  vite: () => ({
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    },
  }),
});
