/**
 * Generates a random state string of a given length.
 * @param length - The length of the generated string.
 * @returns A random string of the specified length.
 */
export function generateRandomState(length: number = 16): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
}
