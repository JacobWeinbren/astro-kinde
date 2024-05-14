import { generateRandomState } from "./crypto.js";

interface AuthConfig {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
    state?: string;
    domain: string;
    clientSecret?: string;
    [key: string]: any;
}

export function createAuthUrl(config: AuthConfig): string {
    // Ensure a state is generated if not already provided
    config.state = config.state || generateRandomState();

    // Construct the base URL for authorization
    const baseUrl = `${config.domain}/oauth2/auth`;

    // Set up URL parameters using URLSearchParams
    const urlParams = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: config.responseType,
        scope: config.scope,
        state: config.state,
    });

    // Return the complete URL with parameters
    return `${baseUrl}?${urlParams.toString()}`;
}

async function makeOAuthRequest(
    url: string,
    params: URLSearchParams,
    method: string = "POST"
): Promise<any> {
    // Perform the HTTP request using fetch API
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    // Check for HTTP errors and throw an exception if found
    if (!response.ok) {
        throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
        );
    }

    // Return the JSON response
    return await response.json();
}

async function getAccessToken(
    code: string,
    config: AuthConfig
): Promise<string> {
    // Construct the token URL
    const tokenUrl = `${config.domain}/oauth2/token`;

    // Prepare parameters, excluding undefined values
    const paramsData: Record<string, string> = {
        grant_type: "authorization_code",
        client_id: config.clientId,
        code,
        redirect_uri: config.redirectUri,
    };
    if (config.clientSecret) {
        paramsData.client_secret = config.clientSecret;
    }

    // Set up the request parameters
    const params = new URLSearchParams(paramsData);

    // Use the general OAuth request function to obtain the token
    const data = await makeOAuthRequest(tokenUrl, params);
    return data.access_token;
}

async function getUserProfile(
    accessToken: string,
    config: AuthConfig
): Promise<any> {
    // Construct the user info URL
    const userInfoUrl = `${config.domain}/oauth2/v2/user_profile`;

    // Perform the fetch operation with authorization header
    const response = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Return the JSON response
    return await response.json();
}

function createLogoutUrl(config: AuthConfig, returnTo: string): string {
    // Construct the logout URL
    const logoutUrl = `${config.domain}/logout`;

    // Set up URL parameters
    const urlParams = new URLSearchParams({
        client_id: config.clientId,
        return_to: returnTo,
    });

    // Return the complete logout URL
    return `${logoutUrl}?${urlParams.toString()}`;
}

async function fetchJwks(config: AuthConfig): Promise<any> {
    // Construct the JWKS URL
    const jwksUrl = `${config.domain}/.well-known/jwks.json`;

    // Use the general OAuth request function to fetch JWKS
    return makeOAuthRequest(jwksUrl, new URLSearchParams(), "GET");
}

async function introspectAccessToken(
    accessToken: string,
    config: AuthConfig
): Promise<any> {
    // Construct the introspection URL
    const introspectUrl = `${config.domain}/oauth2/introspect`;

    // Set up the request parameters
    const params = new URLSearchParams({
        token: accessToken,
        client_id: config.clientId,
    });
    if (config.clientSecret) {
        params.append("client_secret", config.clientSecret);
    }

    // Use the general OAuth request function to perform introspection
    return makeOAuthRequest(introspectUrl, params);
}
