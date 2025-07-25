// MindMark Collections Page
// Server component with client-side interactivity
// Now uses AppLayout for consistency with dashboard

import { Suspense } from "react";
import { CollectionsClient } from "../../components/collections-client";

// Server Component - Auth and layout handled by layout.tsx
export default function CollectionsPage() {
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto h-full">
      {/* Main Content - Client Component for interactivity */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
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
