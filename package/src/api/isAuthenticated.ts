import { type APIRoute } from "astro";
import {
    getAccessTokenFromCookie,
    handleError,
    verifyToken,
} from "../utils.js";
import config from "virtual:kinde-integration/config";

async function introspectToken(token: string) {
    const credentials = `${config.clientId}:${config.clientSecret}`;
    const basicAuth = `Basic ${Buffer.from(credentials).toString("base64")}`;
    const body = new URLSearchParams({
        token,
        token_type_hint: "access_token",
    }).toString();

    const response = await fetch(`${config.domain}/oauth2/introspect`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: basicAuth,
        },
        body,
    });

    if (!response.ok) {
        throw new Error(`Introspection request failed: ${response.statusText}`);
    }

    return response.json();
}

// API route to check if the user is authenticated
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

        const tokenDetails = await introspectToken(accessToken);
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
