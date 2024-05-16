import { safeBase64Decode } from "./crypto.ts";
import { fetchJwks } from "./urls.ts";
import config from "virtual:kinde-integration/config";

// Retrieves the access token from the "kinde_access_token" cookie
export function getAccessTokenFromCookie(request: Request): string | undefined {
    const cookies = request.headers.get("cookie");
    return cookies
        ?.split("; ")
        .find((c) => c.startsWith("kinde_access_token="))
        ?.split("=")[1];
}

export function deleteAccessTokenCookie(headers: Headers): Headers {
    headers.append(
        "Set-Cookie",
        "kinde_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );
    return headers;
}

// A common error handler
export function handleError(error: unknown): Response {
    return new Response(error instanceof Error ? error.message : null, {
        status: 500,
    });
}

// Retrieves the signing key from JWKS using the key ID (kid)
async function getSigningKey(kid: string) {
    const jwks = await fetchJwks(config);
    const signingKey = jwks.keys.find((key: any) => key.kid === kid);

    if (!signingKey) {
        throw new Error(`Unable to find a signing key that matches '${kid}'`);
    }

    return signingKey;
}

// Checks if the user is logged in by validating the access token
export const isLoggedIn = async (
    accessToken: string | null
): Promise<boolean> => {
    if (!accessToken) return false;

    const tokenParts = accessToken.split(".");
    if (tokenParts.length !== 3) {
        return false;
    }

    try {
        const tokenHeader = tokenParts[0];
        if (!tokenHeader) {
            throw new Error("Token header is missing");
        }
        const header = JSON.parse(safeBase64Decode(tokenHeader));

        const signingKey = await getSigningKey(header.kid);
        const publicKey = await crypto.subtle.importKey(
            "jwk",
            signingKey,
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const isValid = await crypto.subtle.verify(
            "RSASSA-PKCS1-v1_5",
            publicKey,
            new Uint8Array(
                Array.from(safeBase64Decode(tokenParts[2] ?? ""), (c) =>
                    c.charCodeAt(0)
                )
            ),
            new TextEncoder().encode(tokenParts[0] + "." + tokenParts[1])
        );

        return isValid;
    } catch (error) {
        console.error(error);
        return false;
    }
};
