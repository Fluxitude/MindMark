// MindMark Content Script
// Runs on all web pages to enhance bookmark saving

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],
  main() {
    console.log("MindMark content script loaded on:", window.location.href);

    // Add keyboard shortcut listener
    document.addEventListener("keydown", (event) => {
      // Ctrl+Shift+M (or Cmd+Shift+M on Mac) to save bookmark
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "M"
      ) {
        event.preventDefault();
        saveCurrentPage();
      }
    });

    // Function to save current page
    function saveCurrentPage() {
      const bookmark = {
        url: window.location.href,
        title: document.title,
        favicon: getFavicon(),
        selectedText: getSelectedText(),
        metadata: extractPageMetadata(),
      };

      // Send to background script
      chrome.runtime.sendMessage(
        {
          type: "SAVE_BOOKMARK",
          bookmark,
        },
        (response) => {
          if (response?.success) {
            showSaveNotification("Bookmark saved successfully!");
          } else {
            showSaveNotification("Failed to save bookmark", "error");
          }
        }
      );
    }

    // Extract page favicon
    function getFavicon(): string | undefined {
      const favicon =
        (document.querySelector('link[rel="icon"]') as HTMLLinkElement) ||
        (document.querySelector(
          'link[rel="shortcut icon"]'
        ) as HTMLLinkElement) ||
        (document.querySelector(
          'link[rel="apple-touch-icon"]'
        ) as HTMLLinkElement);

      if (favicon?.href) {
        return favicon.href;
      }

      // Fallback to default favicon location
      return `${window.location.origin}/favicon.ico`;
    }

    // Get selected text if any
    function getSelectedText(): string {
      return window.getSelection()?.toString().trim() || "";
    }

    // Extract page metadata
    function extractPageMetadata() {
      const getMetaContent = (name: string): string | undefined => {
        const meta =
          (document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement) ||
          (document.querySelector(
            `meta[property="${name}"]`
          ) as HTMLMetaElement);
        return meta?.content;
      };

      return {
        description:
          getMetaContent("description") || getMetaContent("og:description"),
        author: getMetaContent("author"),
        keywords: getMetaContent("keywords"),
        publishedTime: getMetaContent("article:published_time"),
        modifiedTime: getMetaContent("article:modified_time"),
        siteName: getMetaContent("og:site_name"),
        type: getMetaContent("og:type"),
        image: getMetaContent("og:image"),
        wordCount: document.body.innerText.trim().split(/\s+/).length,
        language: document.documentElement.lang || "en",
      };
    }

    // Show save notification
    function showSaveNotification(
      message: string,
      type: "success" | "error" = "success"
    ) {
      // Create notification element
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#000000" : "#dc3545"};
        color: white;
        padding: 12px 16px;
        border-radius: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
        word-wrap: break-word;
      `;
      notification.textContent = message;

      // Add to page
      document.body.appendChild(notification);

      // Remove after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }

    // Listen for messages from popup or background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "GET_PAGE_INFO") {
        sendResponse({
          url: window.location.href,
          title: document.title,
          favicon: getFavicon(),
          selectedText: getSelectedText(),
          metadata: extractPageMetadata(),
        });
      }
    });
  },
});
