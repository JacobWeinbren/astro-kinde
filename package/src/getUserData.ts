import type { AstroGlobal } from "astro";

export async function getUserData(Astro: AstroGlobal) {
    const isAuthenticated = Astro.locals.isAuthenticated;

    if (!isAuthenticated) {
        return null;
    }

    const { request } = Astro;
    const cookies = request.headers.get("cookie");

    const response = await fetch(`${Astro.url.origin}/api/kinde/getUser`, {
        headers: {
            cookie: cookies || "",
        },
    });

    const data = await response.json();
    console.log(data);
    return data;
}
