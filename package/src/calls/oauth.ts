import { kindeApiRequest } from "./common.ts";
import type { AstroGlobal } from "astro";

export async function getUserData(Astro: AstroGlobal) {
    return kindeApiRequest(Astro, "/oauth2/user_profile");
}
