"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@mindmark/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("🔄 Starting auth callback process...");
      const supabase = createSupabaseClient();

      try {
        // Get the code from URL parameters
        const code = searchParams.get('code');
        console.log("🔑 Code from URL:", code ? "Present" : "Missing");

        if (code) {
          console.log("🔄 Exchanging code for session...");

          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Code exchange timeout')), 10000)
          );

          try {
            // Exchange the code for a session with timeout
            const { data, error } = await Promise.race([
              supabase.auth.exchangeCodeForSession(code),
              timeoutPromise
            ]) as any;

            console.log("📦 Raw exchange response:", { data, error });

            if (error) {
              console.error("❌ Auth callback error:", error);
              // If code already used, try to get existing session
              if (error.message?.includes('already been used') || error.message?.includes('invalid')) {
                console.log("🔄 Code already used, checking for existing session...");
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session) {
                  console.log("✅ Found existing session, redirecting to dashboard");
                  router.push("/dashboard");
                  return;
                }
              }
              router.push("/auth/login?error=callback_failed");
              return;
            }

            console.log("✅ Code exchange result:", {
              hasSession: !!data?.session,
              hasUser: !!data?.user,
              sessionId: data?.session?.access_token?.substring(0, 20) + '...'
            });

            if (data?.session) {
              // Successfully authenticated, redirect to dashboard
              console.log("🎉 Authentication successful, redirecting to dashboard");

              // Small delay to ensure auth state is updated
              setTimeout(() => {
                console.log("🚀 Redirecting to dashboard...");
                router.push("/dashboard");
              }, 100);
            } else {
              // No session created, redirect to login
              console.log("❌ No session created");
              router.push("/auth/login?error=no_session");
            }
          } catch (timeoutError) {
            console.error("⏰ Code exchange timed out:", timeoutError);
            // Try to get existing session as fallback
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              console.log("✅ Found existing session after timeout, redirecting to dashboard");
              router.push("/dashboard");
            } else {
              router.push("/auth/login?error=timeout");
            }
          }
        } else {
          console.log("🔍 No code parameter, checking existing session...");
          // No code parameter, check if there's already a session
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("❌ Session check error:", error);
            router.push("/auth/login?error=session_check_failed");
            return;
          }

          if (data.session) {
            console.log("✅ Existing session found, redirecting to dashboard");
            router.push("/dashboard");
          } else {
            console.log("❌ No existing session, redirecting to login");
            router.push("/auth/login?error=no_code");
          }
        }
      } catch (error) {
        console.error("💥 Unexpected error during auth callback:", error);
        router.push("/auth/login?error=unexpected");
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
        <p className="text-xs text-muted-foreground mt-2">
          Code: {searchParams.get('code') ? 'Present' : 'Missing'}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
