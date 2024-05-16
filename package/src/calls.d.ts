import type { AstroGlobal } from "astro";

export declare function getUserProfile(Astro: AstroGlobal): Promise<any>;
export declare function getTokenDetails(
    Astro: AstroGlobal,
    token: string,
    tokenType?: string
): Promise<any>;
export declare function revokeToken(
    Astro: AstroGlobal,
    token: string
): Promise<any>;
