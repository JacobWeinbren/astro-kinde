// Generates a random state string for OAuth requests.
export function generateRandomState(length: number = 16): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
}

// Safely decodes a base64 string
export function safeBase64Decode(base64String: string) {
    base64String = base64String.replace(/-/g, "+").replace(/_/g, "/");
    while (base64String.length % 4) {
        base64String += "=";
    }
    return atob(base64String);
}
