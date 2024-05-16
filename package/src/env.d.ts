/// <reference types="astro/client" />

// Configuration for Kinde integration
declare module "virtual:kinde-integration/config" {
    const config: import("./types.ts").Config;
    export default config;
}

// Configuration for Astro storage
declare namespace App {
    interface Locals {
        isAuthenticated: boolean;
        accessToken: string | undefined;
    }
}
