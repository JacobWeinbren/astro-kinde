import { type APIRoute } from "astro";
import { createAuthUrl } from "../urls.js";
import config from "virtual:kinde-integration/config";

/**
 * Redirects the user to the registration URL with OAuth parameters.
 */
export const GET: APIRoute = async ({ redirect, url }) => {
    // Extract all parameters from the query string
    const queryParams = Object.fromEntries(url.searchParams);

    // Construct the registration URL with additional OAuth parameters
    const registerUrl = createAuthUrl({
        ...config,
        prompt: "create",
        ...queryParams,
    });

    // Redirect the user to the constructed registration URL
    return redirect(registerUrl);
};
