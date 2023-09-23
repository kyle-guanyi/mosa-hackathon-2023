// @ts-nocheck
import { withAuth } from "next-auth/middleware";

/**
 * This is a middleware that will redirect the user to the sign in page if user is not signed in
 */
export default withAuth({
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ url }) {
      // Check if a callbackUrl parameter is present in the query string
      const urlObject = new URL(url);
      const callbackUrl = urlObject.searchParams.get("callbackUrl");

      // If a callbackUrl is present, redirect the user to that URL after signing in
      if (callbackUrl) {
        return callbackUrl;
      }

      // If there's no callbackUrl, redirect the user to the root path ("/")
      return "/";
    },
  },
});

/**
 * This is a middleware that matches all routes except for the ones starting with:
 *
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 *
 */
export const config = {
    matcher: [
      '/((?!about|assets).*)',
    ],
  }