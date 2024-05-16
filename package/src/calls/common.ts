import config from "virtual:kinde-integration/config";
import type { AstroGlobal } from "astro";

export async function kindeApiRequest(
    Astro: AstroGlobal,
    path: string,
    options?: RequestInit
) {
    const url = `${config.domain}${path}`;
    const accessToken = Astro.cookies.get("kinde_access_token");

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        return {
            error: true,
            message: `Kinde API request failed: ${response.statusText}`,
        };
    }

    return response.json();
}
