/**
 * Generates a random state string for OAuth requests.
 */
export function generateRandomState(length: number = 16): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
}

/**
 * Safely decodes a base64 string to handle URL-safe base64 encoding.
 */
export function safeBase64Decode(base64String: string): string {
    // Replace URL-specific characters with standard base64 characters
    base64String = base64String.replace(/-/g, "+").replace(/_/g, "/");

    // Pad base64 string to ensure it is a multiple of 4
    while (base64String.length % 4) {
        base64String += "=";
    }

    // Decode the base64 string
    return atob(base64String);
}
