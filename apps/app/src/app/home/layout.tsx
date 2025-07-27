// Home Page Layout - Uses the same components as dashboard
import { AppLayout } from "../../components/app-layout";
import { ProtectedRoute } from "../../components/auth/protected-route";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppLayout currentPage="home">
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}
