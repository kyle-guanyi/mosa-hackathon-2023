// @ts-nocheck
import { withAuth } from "next-auth/middleware";

/**
 * This is a middleware that will redirect the user to the sign in page if user is not signed in
 */
export default withAuth({
  pages: {
    signIn: "/",
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
      '/((?!about|assets/images/shield.png|assets/images/logo.png).*)',
    ],
  }