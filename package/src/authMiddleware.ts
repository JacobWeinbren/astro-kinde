import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, locals } = context;
    const url = new URL(request.url);

    // Skip middleware for specific API route
    if (url.pathname === "/api/kinde/isAuthenticated") {
        return next();
    }

    const cookies = request.headers.get("cookie");
    const response = await fetch(`${url.origin}/api/kinde/isAuthenticated`, {
        headers: {
            cookie: cookies || "",
        },
    });

    const isAuthenticated = response.ok;

    locals.isAuthenticated = isAuthenticated as boolean;
    return next();
});
