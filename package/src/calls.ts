import { getAccessTokenFromCookie } from "./utils.ts";
import config from "virtual:kinde-integration/config";

export async function kindeApiRequest(path: string, options?: RequestInit) {
    const request = new Request(path, options);
    const accessToken = getAccessTokenFromCookie(request);
    const url = `https://${config.businessName}.kinde.com/api/v1${path}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Kinde API request failed: ${response.statusText}`);
    }

    return response.json();
}

export async function listApis() {
    return kindeApiRequest("/apis");
}

export async function getApiDetails(apiId: string) {
    return kindeApiRequest(`/apis/${apiId}`);
}

export async function createApi(data: any) {
    return kindeApiRequest("/apis", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateApi(apiId: string, data: any) {
    return kindeApiRequest(`/apis/${apiId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteApi(apiId: string) {
    return kindeApiRequest(`/apis/${apiId}`, {
        method: "DELETE",
    });
}
