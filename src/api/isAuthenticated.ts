import { APIRoute } from "astro";
import { introspectAccessToken } from "../urls.ts";
import config from "virtual:kinde-integration/config";
import { getAccessTokenFromCookie, handleError } from "../utils.js";

export const GET: APIRoute = async ({ request }) => {
    const accessToken = getAccessTokenFromCookie(request);

    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        const introspectionResult = await introspectAccessToken(
            accessToken,
            config
        );
        return new Response(JSON.stringify(introspectionResult), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return handleError(error);
    }
};
