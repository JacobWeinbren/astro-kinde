import { type APIRoute } from "astro";
import {
    getAccessTokenFromCookie,
    handleError,
    verifyToken,
} from "../utils.js";
import config from "virtual:kinde-integration/config";

/**
 * Introspects the provided token using the OAuth server's introspection endpoint.
 */
async function introspectToken(token: string) {
    // Prepare the authentication and body for the introspection request
    const credentials = `${config.clientId}:${config.clientSecret}`;
    const basicAuth = `Basic ${Buffer.from(credentials).toString("base64")}`;
    const body = new URLSearchParams({
        token,
        token_type_hint: "access_token",
    }).toString();

    // Perform the POST request to the introspection endpoint with the necessary headers and body
    const response = await fetch(`${config.domain}/oauth2/introspect`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: basicAuth,
        },
        body,
    });

    // Check if the response from the server is successful
    if (!response.ok) {
        throw new Error(`Introspection request failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * API route to check if the user is authenticated by verifying the access token.
 */
export const GET: APIRoute = async ({ request }) => {
    const accessToken = getAccessTokenFromCookie(request);

    // Return 401 if no access token is found
    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        // Verify the validity of the access token
        const isValid = await verifyToken(accessToken);
        if (!isValid) {
            return new Response("Invalid token", { status: 401 });
        }

        // Introspect the token to check if it is still active
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
        // Handle any errors that occur during the process
        return handleError(error);
    }
};
