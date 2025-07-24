import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("🔄 API Auth callback - Code:", code ? "Present" : "Missing");

  if (code) {
    const cookieStore = await cookies();

    // Create server client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    try {
      console.log("🔄 Exchanging code for session...");
      console.log("🔧 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("🔧 Code length:", code.length);

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      console.log("📦 Exchange response:", {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error ? {
          message: error.message,
          status: error.status,
          details: error
        } : null
      });

      if (error) {
        console.error("❌ Auth callback error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          cause: error.cause,
          fullError: error
        });
        return NextResponse.redirect(`${origin}/auth/login?error=callback_failed&details=${encodeURIComponent(error.message)}`);
      }

      if (data.session) {
        console.log("✅ Session created successfully");

        // The server client automatically handles setting the proper cookies
        // Just redirect to the dashboard
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.log("❌ No session in response");
        return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
      }
    } catch (error) {
      console.error("💥 Unexpected error:", error);
      return NextResponse.redirect(`${origin}/auth/login?error=unexpected`);
    }
  }

  console.log("❌ No code parameter");
  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
}
