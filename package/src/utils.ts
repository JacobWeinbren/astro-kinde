import { safeBase64Decode } from "./crypto.ts";
import { fetchJwks } from "./urls.ts";
import config from "virtual:kinde-integration/config";

/* Retrieves the access token from the "kinde_access_token" cookie */
export function getAccessTokenFromCookie(request: Request): string | undefined {
    const cookies = request.headers.get("cookie");
    return cookies
        ?.split("; ")
        .find((c) => c.startsWith("kinde_access_token="))
        ?.split("=")[1];
}

/* Deletes the access token cookie by setting its expiry date in the past */
export function deleteAccessTokenCookie(headers: Headers): Headers {
    headers.append(
        "Set-Cookie",
        "kinde_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );
    return headers;
}

/* Sets the access token cookie with HttpOnly and a Max-Age attribute */
export function setAccessTokenCookie(
    headers: Headers,
    accessToken: string,
    maxAge: number = 3600
): Headers {
    headers.append(
        "Set-Cookie",
        `kinde_access_token=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAge}`
    );
    return headers;
}

/* Common error handler that returns a 500 response with the error message */
export function handleError(error: unknown): Response {
    return new Response(error instanceof Error ? error.message : null, {
        status: 500,
    });
}

/* Retrieves the signing key from JWKS using the key ID (kid) */
async function getSigningKey(kid: string) {
    const jwks = await fetchJwks(config);
    // Find the signing key that matches the provided kid
    const signingKey = jwks.keys.find((key: any) => key.kid === kid);

    if (!signingKey) {
        throw new Error(`Unable to find a signing key that matches '${kid}'`);
    }

    return signingKey;
}

/* Validates the access token by verifying its signature and structure */
export const verifyToken = async (
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

        // Decode the header and extract the key ID
        const header = JSON.parse(safeBase64Decode(tokenHeader));

        // Retrieve the signing key using the key ID from the token header
        const signingKey = await getSigningKey(header.kid);

        // Import the public key for verification
        const publicKey = await crypto.subtle.importKey(
            "jwk",
            signingKey,
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"]
        );

        // Verify the signature of the token
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
