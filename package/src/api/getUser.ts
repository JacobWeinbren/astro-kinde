import { APIRoute } from "astro";
import { getUserProfile } from "../urls.js";
import config from "virtual:kinde-integration/config";
import { getAccessTokenFromCookie, handleError } from "../utils.js";

export const GET: APIRoute = async ({ request }) => {
    const accessToken = getAccessTokenFromCookie(request);

    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        const userProfile = await getUserProfile(accessToken, config);
        return new Response(JSON.stringify(userProfile), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return handleError(error);
    }
};
