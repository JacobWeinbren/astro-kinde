import { kindeApiRequest } from "./common.ts";
import type { AstroGlobal } from "astro";

export async function listApis(Astro: AstroGlobal) {
    return kindeApiRequest(Astro, "/api/v1/apis", {}, "application/json");
}

export async function addApi(
    Astro: AstroGlobal,
    name: string,
    audience: string
) {
    return kindeApiRequest(
        Astro,
        "/api/v1/apis",
        {
            method: "POST",
            body: JSON.stringify({ name, audience }),
        },
        "application/json"
    );
}

export async function getApiDetails(Astro: AstroGlobal, apiId: string) {
    return kindeApiRequest(
        Astro,
        `/api/v1/apis/${apiId}`,
        {},
        "application/json"
    );
}

export async function deleteApi(Astro: AstroGlobal, apiId: string) {
    return kindeApiRequest(
        Astro,
        `/api/v1/apis/${apiId}`,
        {
            method: "DELETE",
        },
        "application/json"
    );
}

export async function updateApiApplications(
    Astro: AstroGlobal,
    apiId: string,
    applicationIds: string[]
) {
    return kindeApiRequest(
        Astro,
        `/api/v1/apis/${apiId}/applications`,
        {
            method: "PUT",
            body: JSON.stringify({ application_ids: applicationIds }),
        },
        "application/json"
    );
}
