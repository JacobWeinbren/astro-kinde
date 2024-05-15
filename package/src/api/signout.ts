import { APIRoute } from "astro";
import { createLogoutUrl } from "../urls.js";
import { deleteAccessTokenCookie } from "../utils.js";
import config from "virtual:kinde-integration/config";

// Handles user sign-out by redirecting to the logout URL
export const GET: APIRoute = async ({ request, redirect }) => {
    const returnTo = config.signedOutUri;
    const logoutUrl = createLogoutUrl(config, returnTo);
    const headers = new Headers();
    deleteAccessTokenCookie(headers);
    headers.set("Location", logoutUrl);
    return new Response(null, { headers: headers, status: 302 });
};
