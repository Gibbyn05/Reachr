import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://polyfill.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.reachr.no https://api.resend.com https://api.stripe.com https://*.stripe.com wss:; frame-src 'self' https://*.stripe.com;"
  );
}

export async function middleware(request: NextRequest) {
  // Skip auth if Supabase env vars are not configured (e.g. preview deployments)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const response = NextResponse.next({ request });
    addSecurityHeaders(response);
    return response;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Intercept auth codes — exchange them server-side before the page loads
  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/auth/")) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const url = request.nextUrl.clone();
    url.searchParams.delete("code");
    const redirect = NextResponse.redirect(url);
    if (!error) {
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirect.cookies.set(c.name, c.value),
      );
    }
    addSecurityHeaders(redirect);
    return redirect;
  }

  // Refresh session – keeps the user logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect app routes (onboarding is accessible without auth since user may not yet have a confirmed session)
  const isProtected = request.nextUrl.pathname.match(
    /^\/(dashboard|leadsok|mine-leads|varsler|innstillinger|rapporter|admin|kalender|sekvenser)/,
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirect = NextResponse.redirect(url);
    addSecurityHeaders(redirect);
    return redirect;
  }

  // Redirect authenticated users away from auth pages,
  // but NOT if they're following an invite link (invite params must be handled by the page)
  const isAuthPage = request.nextUrl.pathname.match(/^\/(login|register)/);
  const hasInviteParams = request.nextUrl.searchParams.has("invite");
  if (isAuthPage && user && !hasInviteParams) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirect = NextResponse.redirect(url);
    addSecurityHeaders(redirect);
    return redirect;
  }

  addSecurityHeaders(supabaseResponse);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
