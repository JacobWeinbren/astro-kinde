import { APIRoute } from "astro";
import { createAuthUrl } from "../urls.js";
import config from "virtual:kinde-integration/config";

// Redirects to the login URL with appropriate OAuth parameters
export const POST: APIRoute = async ({ redirect }) => {
    const loginUrl = createAuthUrl({ ...config, prompt: "login" });
    return redirect(loginUrl);
};
