/// <reference types="astro/client" />

// Configuration for Kinde integration
declare module "virtual:kinde-integration/config" {
    const config: import("./types.ts").Config;
    export default config;
}

declare namespace App {
    interface Locals {
        isAuthenticated: boolean;
    }
}
