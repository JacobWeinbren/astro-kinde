import { kindeApiRequest, createBody } from "./common.ts";
import type { AstroGlobal } from "astro";
import config from "virtual:kinde-integration/config";

export async function getTokenDetails(
    Astro: AstroGlobal,
    token: string,
    tokenType: string = "Bearer"
) {
    const body = createBody({ token, token_type: tokenType });
    return kindeApiRequest(Astro, "/oauth2/introspect", {
        method: "POST",
        body: body,
    });
}

export async function revokeToken(Astro: AstroGlobal, token: string) {
    const body = createBody({
        token,
        client_id: config.clientId,
        client_secret: config.clientSecret,
    });
    return kindeApiRequest(Astro, "/oauth2/revoke", {
        method: "POST",
        body: body,
    });
}

export async function getUserProfile(Astro: AstroGlobal) {
    return kindeApiRequest(Astro, "/oauth2/v2/user_profile");
}
