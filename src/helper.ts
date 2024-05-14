import { makeOAuthRequest, introspectAccessToken } from "./urls.js";
import config from "virtual:kinde-integration/config";

// Checks if user is authenticated by introspecting the access token
export async function isAuthenticated(): Promise<boolean> {
    const accessToken = Astro.cookies.get("kinde_access_token")?.value;
    if (!accessToken) return false;
    try {
        const introspectionResponse = await introspectAccessToken(
            accessToken,
            config
        );
        return introspectionResponse.active;
    } catch (error) {
        console.error("Authentication check failed:", error);
        return false;
    }
}

// Fetches user information using the access token
export async function getUser(): Promise<any> {
    const accessToken = Astro.cookies.get("kinde_access_token")?.value ?? null;
    if (!accessToken) throw new Error("Access token not found");
    const userInfoUrl = `${config.domain}/oauth2/v2/user_profile`;
    const params = new URLSearchParams({ access_token: accessToken });
    return makeOAuthRequest(userInfoUrl, params, "GET");
}
