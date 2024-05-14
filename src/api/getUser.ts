import { APIRoute } from "astro";
import { getUserProfile } from "../urls.js";
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
        const userProfile = await getUserProfile(accessToken, config);
        return new Response(JSON.stringify(userProfile), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
};
