import { type APIRoute } from "astro";
import { getAccessTokenFromCookie, handleError, isLoggedIn } from "../utils.js";

// API route to check if the user is authenticated
export const GET: APIRoute = async ({ request }) => {
    const accessToken = getAccessTokenFromCookie(request);

    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        if (await isLoggedIn(accessToken)) {
            return new Response("Authenticated", {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response("Not Authenticated", { status: 401 });
        }
    } catch (error) {
        return handleError(error);
    }
};
