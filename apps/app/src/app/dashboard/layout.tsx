// Dashboard Layout - Next.js 14 App Router
// This layout wraps all dashboard pages with AppLayout

import { AppLayout } from "../../components/app-layout";
import { ProtectedRoute } from "../../components/auth/protected-route";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <AppLayout currentPage="dashboard">
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}
