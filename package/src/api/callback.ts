import { APIRoute } from "astro";
import config from "virtual:kinde-integration/config";

export const GET: APIRoute = async ({ request, redirect }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return redirect("/error");
    }

    const tokenEndpoint = `${config.domain}/oauth2/token`;
    const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: config.callbackUri,
    });

    const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!tokenResponse.ok) {
        return redirect("/error");
    }

    const { access_token } = await tokenResponse.json();

    const headers = new Headers({
        "Set-Cookie": `kinde_access_token=${access_token}; HttpOnly; Path=/; Max-Age=3600`,
    });

    // Redirect to signedInUri after successful authorization
    headers.append("Location", config.signedInUri);
    return new Response(null, { status: 302, headers: headers });
};
