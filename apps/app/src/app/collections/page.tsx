// MindMark Collections Page
// Server component with client-side interactivity

import { Suspense } from "react";
import { NavigationHeader } from "../../components/navigation-header";
import { CollectionsClient } from "../../components/collections-client";

// Server Component - No auth check needed here as middleware handles it
export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Main Content - Client Component for interactivity */}
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      }>
        <CollectionsClient />
      </Suspense>
    </div>
  );
}
