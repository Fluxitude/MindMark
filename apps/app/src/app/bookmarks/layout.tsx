// Bookmarks Layout - Next.js 14 App Router
// This layout wraps all bookmark pages with AppLayout

import { AppLayout } from "../../components/app-layout";
import { ProtectedRoute } from "../../components/auth/protected-route";

interface BookmarksLayoutProps {
  children: React.ReactNode;
}

export default function BookmarksLayout({ children }: BookmarksLayoutProps) {
  return (
    <ProtectedRoute>
      <AppLayout currentPage="bookmarks">
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}
