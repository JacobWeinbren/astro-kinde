import config from "virtual:kinde-integration/config";
import type { AstroGlobal } from "astro";

export async function kindeApiRequest(
    Astro: AstroGlobal,
    path: string,
    options?: RequestInit,
    contentType: string = "application/x-www-form-urlencoded"
) {
    const url = `${config.domain}${path}`;
    const accessToken = Astro.cookies.get("kinde_access_token")?.value ?? "";

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
        return {
            error: true,
            status: response.status,
            message: `Kinde API request failed: ${response.statusText}`,
        };
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    data.status = response.status;
    return data;
}

export function createBody(params: Record<string, string>): string {
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        body.append(key, value);
    }
    return body.toString();
}
