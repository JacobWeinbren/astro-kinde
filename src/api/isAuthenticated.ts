import { APIRoute } from "astro";
import { introspectAccessToken } from "../urls.ts";
import config from "virtual:kinde-integration/config";

export const GET: APIRoute = async ({ request }) => {
    const cookies = request.headers.get("cookie");
    const accessToken = cookies
        ?.split("; ")
        .find((c) => c.startsWith("kinde_access_token="))
        ?.split("=")[1];

    if (!accessToken) {
        return new Response("No access token found", { status: 401 });
    }

    try {
        const introspectionResult = await introspectAccessToken(
            accessToken,
            config
        );
        return new Response(JSON.stringify(introspectionResult), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(error instanceof Error ? error.message : null, {
            status: 500,
        });
    }
};
