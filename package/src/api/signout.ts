import { type APIRoute } from "astro";
import { createLogoutUrl } from "../urls.js";
import { deleteAccessTokenCookie } from "../utils.js";
import config from "virtual:kinde-integration/config";

/**
 * Handles user sign-out by redirecting to the logout URL.
 */
export const GET: APIRoute = async () => {
    // Retrieve the URI to redirect to after logout
    const returnTo = config.signedOutUri;

    // Generate the logout URL with the return URI
    const logoutUrl = createLogoutUrl(config, returnTo);

    // Initialize headers and delete the access token cookie
    const headers = new Headers();
    deleteAccessTokenCookie(headers);

    // Set the Location header to redirect the user to the logout URL
    headers.set("Location", logoutUrl);

    // Return a 302 redirect response
    return new Response(null, { headers: headers, status: 302 });
};
