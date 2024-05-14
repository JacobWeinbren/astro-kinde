/// <reference types="astro/client" />

declare module "virtual:kinde-integration/config" {
    const config: import("./types.ts").Config;
    export default config;
}
