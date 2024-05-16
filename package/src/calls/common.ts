import config from "virtual:kinde-integration/config";
import type { AstroGlobal } from "astro";

export async function kindeApiRequest(
    Astro: AstroGlobal,
    path: string,
    options?: RequestInit,
    contentType = "application/json"
) {
    const url = `${config.domain}${path}`;
    const accessToken = Astro.cookies.get("kinde_access_token")?.value ?? "";

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": contentType,
                Accept: "application/json",
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => "");
            const errorMessage = `Kinde API request failed: ${response.statusText}`;
            return { error: true, message: errorMessage, errorBody };
        }

        const data = await response.json().catch(() => ({}));
        data.status = response.status;
        return data;
    } catch (error) {
        console.error("Kinde API request failed:", error);
        return { error: true, message: "Kinde API request failed" };
    }
}

export function createBody(params: Record<string, string>): string {
    return new URLSearchParams(params).toString();
}
