import type { MiddlewareHandler } from "astro";

export const authMiddleware: MiddlewareHandler = async (
    { request, locals },
    next
) => {
    const cookies = request.headers.get("cookie");
    const response = await fetch(
        `${new URL(request.url).origin}/api/kinde/isAuthenticated`,
        {
            headers: {
                cookie: cookies || "",
            },
        }
    );

    const isAuthenticated = response.ok;

    if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    locals.isAuthenticated = isAuthenticated as boolean;
    return next();
};
