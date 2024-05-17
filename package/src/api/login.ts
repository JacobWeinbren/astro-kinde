import { type APIRoute } from "astro";
import { createAuthUrl } from "../urls.js";
import config from "virtual:kinde-integration/config";

/**
 * Redirects the user to the OAuth login URL with necessary parameters.
 */
export const GET: APIRoute = async ({ redirect, url }) => {
    // Extract all parameters from the query string
    const queryParams = Object.fromEntries(url.searchParams);

    // Construct the login URL with additional OAuth parameters
    const loginUrl = createAuthUrl({
        ...config,
        prompt: "login",
        ...queryParams,
    });

    // Redirect the user to the constructed login URL
    return redirect(loginUrl);
};
