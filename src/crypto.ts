/**
 * Generates a random state string for OAuth requests.
 * @param length - Length of the string (default 16).
 * @returns Random string.
 */
export function generateRandomState(length: number = 16): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
}
