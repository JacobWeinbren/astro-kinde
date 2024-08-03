import { type APIRoute } from "astro";
import config from "virtual:kinde-integration/config";
import { setAccessTokenCookie } from "../utils.ts";

/**
 * Handles the OAuth callback, exchanges the code for an access token, and redirects the user.
 */
export const GET: APIRoute = async ({ request, redirect }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    // Redirect to signed-out page if code is missing
    if (!code) {
        return redirect(config.signedOutUri);
    }

    // Prepare the request for obtaining the access token
    const tokenEndpoint = `${config.domain}/oauth2/token`;
    const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: config.callbackUri,
    });

    // Fetch the access token from the OAuth server
    const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    // Redirect to signed-out page if token request fails
    if (!tokenResponse.ok) {
        return redirect(config.signedOutUri);
    }

    const { access_token } = await tokenResponse.json();

    // Set the access token in cookies and prepare the redirect response
    const headers = new Headers();
    setAccessTokenCookie(
        headers,
        access_token,
        config.sessionMaxAge && config.sessionMaxAge
    );
    headers.append("Location", config.signedInUri);
    return new Response(null, { status: 302, headers: headers });
};
