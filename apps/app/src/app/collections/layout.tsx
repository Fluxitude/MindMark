// Collections Layout - Next.js 14 App Router
// This layout wraps all collections pages with AppLayout for consistency

import { AppLayout } from "../../components/app-layout";
import { ProtectedRoute } from "../../components/auth/protected-route";

interface CollectionsLayoutProps {
  children: React.ReactNode;
}

export default function CollectionsLayout({ children }: CollectionsLayoutProps) {
  return (
    <ProtectedRoute>
      <AppLayout currentPage="collections">
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}
