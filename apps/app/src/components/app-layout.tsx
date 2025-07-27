// MindMark App Layout - Fixed Scrolling
// Main layout with fixed sidebar and scrollable content

"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: "home" | "bookmarks" | "collections" | "digest" | "search";
  showSidebar?: boolean;
}

export function AppLayout({
  children,
  currentPage = "home",
  showSidebar = true
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="bg-background flex overflow-hidden"
      style={{ height: '100vh', maxHeight: '100vh' }}
      data-component="app-layout"
      data-debug="app-layout-container"
    >
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
        />
      )}

      {/* Main Content - Scrollable Area */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ height: '100vh' }}
        data-component="app-layout-main"
        data-debug="scrollable-content-area"
      >
        {children}
      </main>
    </div>
  );
}
