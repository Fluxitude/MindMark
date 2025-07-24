// MindMark Extension Background Script
// Service worker for Manifest V3

export default defineBackground({
  main() {
    console.log("MindMark extension background script loaded");

    // Context menu setup
    chrome.runtime.onInstalled.addListener(() => {
      // Create context menu items
      chrome.contextMenus.create({
        id: "save-to-mindmark",
        title: "Save to MindMark",
        contexts: ["page", "link"],
      });

      chrome.contextMenus.create({
        id: "save-link-to-mindmark",
        title: "Save Link to MindMark",
        contexts: ["link"],
      });
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "save-to-mindmark") {
        handleSaveBookmark({
          url: tab?.url || "",
          title: tab?.title || "",
          favicon: tab?.favIconUrl,
        });
      } else if (info.menuItemId === "save-link-to-mindmark" && info.linkUrl) {
        handleSaveBookmark({
          url: info.linkUrl,
          title: info.selectionText || info.linkUrl,
          favicon: undefined,
        });
      }
    });

    // Handle bookmark saving
    async function handleSaveBookmark(bookmark: {
      url: string;
      title: string;
      favicon?: string;
      description?: string;
    }) {
      try {
        console.log("Saving bookmark:", bookmark);

        // Get auth token from storage
        const { authToken } = await chrome.storage.sync.get(["authToken"]);

        if (!authToken) {
          throw new Error("Please log in to MindMark first");
        }

        // Call MindMark API
        const response = await fetch("https://mindmark.app/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            favicon_url: bookmark.favicon,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save bookmark");
        }

        const result = await response.json();
        console.log("Bookmark saved successfully:", result.bookmark);

        // Show success notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon/48.png",
          title: "MindMark",
          message: `Bookmark saved: ${bookmark.title}`,
        });

        return result.bookmark;
      } catch (error) {
        console.error("Failed to save bookmark:", error);

        // Show error notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon/48.png",
          title: "MindMark Error",
          message: error instanceof Error ? error.message : "Failed to save bookmark. Please try again.",
        });

        throw error;
      }
    }

    // Handle keyboard shortcuts
    chrome.commands.onCommand.addListener((command) => {
      if (command === "save-current-page") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab?.url && tab?.title) {
            handleSaveBookmark({
              url: tab.url,
              title: tab.title,
              favicon: tab.favIconUrl,
            });
          }
        });
      }
    });

    // Handle messages from content scripts or popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "SAVE_BOOKMARK") {
        handleSaveBookmark(message.bookmark)
          .then(() => sendResponse({ success: true }))
          .catch((error) =>
            sendResponse({ success: false, error: error.message })
          );
        return true; // Keep message channel open for async response
      }

      if (message.type === "GET_BOOKMARKS") {
        chrome.storage.local
          .get("bookmarks")
          .then((result) => sendResponse({ bookmarks: result.bookmarks || [] }))
          .catch((error) =>
            sendResponse({ bookmarks: [], error: error.message })
          );
        return true;
      }
    });
  },
});
