import {
    createAuthUrl,
    makeOAuthRequest,
    createLogoutUrl,
    introspectAccessToken,
} from "./urls.js";
import { AuthConfig } from "./types.ts";

/**
 * Initiates the login process by redirecting to the Kinde login URL.
 * @param config - The authentication configuration.
 */
export function login(config: AuthConfig): void {
    const loginUrl = createAuthUrl({ ...config, prompt: "login" });
    window.location.href = loginUrl;
}

/**
 * Initiates the registration process by redirecting to the Kinde registration URL.
 * @param config - The authentication configuration.
 */
export function register(config: AuthConfig): void {
    const registerUrl = createAuthUrl({ ...config, prompt: "create" });
    window.location.href = registerUrl;
}

/**
 * Signs out the user by redirecting to the Kinde logout URL.
 * @param config - The authentication configuration.
 * @param returnTo - The URL to return to after logout.
 */
export function signOut(config: AuthConfig, returnTo: string): void {
    const logoutUrl = createLogoutUrl(config, returnTo);
    window.location.href = logoutUrl;
}

/**
 * Checks if the user is authenticated by verifying the access token.
 * @param accessToken - The access token to verify.
 * @param config - The authentication configuration.
 * @returns A promise that resolves to a boolean indicating if the user is authenticated.
 */
export async function isAuthenticated(
    accessToken: string,
    config: AuthConfig
): Promise<boolean> {
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

/**
 * Fetches the user's profile using the access token.
 * @param accessToken - The access token.
 * @param config - The authentication configuration.
 * @returns A promise that resolves to the user's profile.
 */
export async function getUser(
    accessToken: string,
    config: AuthConfig
): Promise<any> {
    const userInfoUrl = `${config.domain}/oauth2/v2/user_profile`;
    const params = new URLSearchParams({ access_token: accessToken });
    return makeOAuthRequest(userInfoUrl, params, "GET");
}
