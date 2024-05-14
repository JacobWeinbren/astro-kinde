import { APIRoute } from "astro";
import { createLogoutUrl } from "../urls.js";
import config from "virtual:kinde-integration/config";

// Handles user sign-out by redirecting to the logout URL
export const POST: APIRoute = async ({ redirect }) => {
    const returnTo = config.signoutUri;
    const logoutUrl = createLogoutUrl(config, returnTo);
    return redirect(logoutUrl);
};
