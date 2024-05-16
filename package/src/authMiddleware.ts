import { defineMiddleware } from "astro/middleware";
import { getAccessTokenFromCookie } from "./utils.ts";

/**
 * Middleware to handle authentication status and access token retrieval.
 */
export const onRequest = defineMiddleware(async (context, next) => {
    const { request, locals } = context;
    const url = new URL(request.url);

    // Skip middleware for paths under /api/kinde, except for signout
    if (url.pathname.startsWith("/api/kinde/")) {
        if (url.pathname.startsWith("/api/kinde/signout")) {
            locals.accessToken = undefined;
        }
        return next();
    }

    // Retrieve access token from cookies and store in locals
    const accessToken = getAccessTokenFromCookie(request);
    if (accessToken) {
        locals.accessToken = accessToken;
    }

    // Check authentication status by calling the isAuthenticated API endpoint
    const cookies = request.headers.get("cookie");
    const response = await fetch(`${url.origin}/api/kinde/isAuthenticated`, {
        headers: { cookie: cookies || "" },
    });

    // Update isAuthenticated status in locals based on the API response
    locals.isAuthenticated = response.ok;
    return next();
});
