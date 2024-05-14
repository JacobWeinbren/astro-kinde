// Retrieves the access token from the "kinde_access_token" cookie
export function getAccessTokenFromCookie(request: Request): string | undefined {
    const cookies = request.headers.get("cookie");
    return cookies
        ?.split("; ")
        .find((c) => c.startsWith("kinde_access_token="))
        ?.split("=")[1];
}

// A common error handler
export function handleError(error: unknown): Response {
    return new Response(error instanceof Error ? error.message : null, {
        status: 500,
    });
}
