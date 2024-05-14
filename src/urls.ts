import { generateRandomState } from "./crypto.js";

export interface AuthConfig {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
    state?: string;
    domain: string;
    clientSecret?: string;
    [key: string]: any;
}

// Generates an authorization URL with provided configuration
export function createAuthUrl(config: AuthConfig): string {
    config.state = config.state || generateRandomState();
    const baseUrl = `${config.domain}/oauth2/auth`;
    const urlParams = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: config.responseType,
        scope: config.scope,
        state: config.state,
    });
    return `${baseUrl}?${urlParams.toString()}`;
}

// Makes an OAuth request and returns the response data
export async function makeOAuthRequest(
    url: string,
    params: URLSearchParams,
    method: string = "POST"
): Promise<any> {
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });
    if (!response.ok) {
        throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
        );
    }
    return await response.json();
}

// Retrieves an access token using an authorization code
export async function getAccessToken(
    code: string,
    config: AuthConfig
): Promise<string> {
    const tokenUrl = `${config.domain}/oauth2/token`;
    const paramsData: Record<string, string> = {
        grant_type: "authorization_code",
        client_id: config.clientId,
        code,
        redirect_uri: config.redirectUri,
    };
    if (config.clientSecret) {
        paramsData.client_secret = config.clientSecret;
    }
    const params = new URLSearchParams(paramsData);
    const data = await makeOAuthRequest(tokenUrl, params);
    return data.access_token;
}

// Fetches user profile using an access token
export async function getUserProfile(
    accessToken: string,
    config: AuthConfig
): Promise<any> {
    const userInfoUrl = `${config.domain}/oauth2/v2/user_profile`;
    const response = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return await response.json();
}

// Creates a logout URL
export function createLogoutUrl(config: AuthConfig, returnTo: string): string {
    const logoutUrl = `${config.domain}/logout`;
    const urlParams = new URLSearchParams({
        client_id: config.clientId,
        return_to: returnTo,
    });
    return `${logoutUrl}?${urlParams.toString()}`;
}

// Fetches JWKS from the domain
export async function fetchJwks(config: AuthConfig): Promise<any> {
    const jwksUrl = `${config.domain}/.well-known/jwks.json`;
    return makeOAuthRequest(jwksUrl, new URLSearchParams(), "GET");
}

// Introspects an access token to check its validity
export async function introspectAccessToken(
    accessToken: string,
    config: AuthConfig
): Promise<any> {
    const introspectUrl = `${config.domain}/oauth2/introspect`;
    const params = new URLSearchParams({
        token: accessToken,
        client_id: config.clientId,
    });
    if (config.clientSecret) {
        params.append("client_secret", config.clientSecret);
    }
    return makeOAuthRequest(introspectUrl, params);
}
