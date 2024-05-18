import { type APIRoute } from "astro";
import { introspectAccessToken } from "../urls.ts";
import config from "virtual:kinde-integration/config";
import {
    getAccessTokenFromCookie,
    handleError,
    verifyToken,
} from "../utils.js";

/**
 * API route to check if the user is authenticated by verifying the access token.
 */
export const GET: APIRoute = async ({ request }) => {
    const accessToken = getAccessTokenFromCookie(request);

    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        const isValid = await verifyToken(accessToken);
        if (!isValid) {
            return new Response("Invalid token", { status: 401 });
        }

        const tokenDetails = await introspectAccessToken(accessToken, config);
        if (tokenDetails.active) {
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
