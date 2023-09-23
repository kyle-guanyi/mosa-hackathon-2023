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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
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