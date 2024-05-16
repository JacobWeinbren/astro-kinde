import { type APIRoute } from "astro";
import { createAuthUrl } from "../urls.js";
import config from "virtual:kinde-integration/config";

/**
 * Redirects the user to the registration URL with OAuth parameters.
 */
export const GET: APIRoute = async ({ redirect }) => {
    // Construct the login URL with additional OAuth parameters
    const registerUrl = createAuthUrl({ ...config, prompt: "create" });

    // Redirect the user to the constructed registration URL
    return redirect(registerUrl);
};
