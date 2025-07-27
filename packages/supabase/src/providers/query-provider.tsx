"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with optimized settings
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: How long data is considered fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Cache time: How long data stays in cache after component unmounts
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        // Retry failed requests
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });
};

let clientSingleton: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientSingleton) clientSingleton = createQueryClient();
    return clientSingleton;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Lazy load devtools only when needed */}
      {process.env.NODE_ENV === "development" && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}

// Export query client for use in mutations and other places
export { getQueryClient };
