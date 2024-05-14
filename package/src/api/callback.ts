import { APIRoute } from "astro";

// Handles the OAuth callback, storing the authorization code in a cookie
export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
        return new Response("Unauthorized", { status: 401 });
    }
    const headers = new Headers({
        "Set-Cookie": `kinde_access_token=${code}; HttpOnly; Path=/; Max-Age=3600`,
    });
    return new Response("Code stored in cookie", { status: 200, headers });
};
