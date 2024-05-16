import { type APIRoute } from "astro";
import { getUserProfile } from "../urls.js";
import config from "virtual:kinde-integration/config";
import { getAccessTokenFromCookie, handleError } from "../utils.js";

/**
 * Retrieves the user profile using the access token from the cookie.
 */
export const GET: APIRoute = async ({ request }) => {
    // Extract the access token from the cookie
    const accessToken = getAccessTokenFromCookie(request);

    // Respond with 401 Unauthorized if no access token is found
    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        // Fetch the user profile using the access token
        const userProfile = await getUserProfile(accessToken, config);

        // Return the user profile with appropriate headers
        return new Response(JSON.stringify(userProfile), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return handleError(error);
    }
};
