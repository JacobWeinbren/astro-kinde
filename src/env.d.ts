/// <reference types="astro/client" />

declare module "virtual:kinde-integration/config" {
    const config: import("./types.js").Config;
    export default config;
}
