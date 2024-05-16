import {
    defineIntegration,
    addVirtualImports,
    createResolver,
} from "astro-integration-kit";
import { z } from "astro/zod";
import type { Config } from "./types.ts";

const defaultConfig = {
    clientId: "",
    clientSecret: "",
    domain: "",
    callbackUri: "",
    signedInUri: "",
    signedOutUri: "",
    responseType: "code",
    scope: "openid email profile offline",
} satisfies Partial<Config>;

/**
 * Injects predefined routes into the application
 */
function injectRoutes(params: any, resolve: (path: string) => string) {
    // Define all routes with their respective patterns and entrypoints
    const routes = [
        { pattern: "/api/kinde/login", entrypoint: "./api/login.js" },
        { pattern: "/api/kinde/register", entrypoint: "./api/register.js" },
        { pattern: "/api/kinde/callback", entrypoint: "./api/callback.js" },
        { pattern: "/api/kinde/signout", entrypoint: "./api/signout.js" },
        {
            pattern: "/api/kinde/isAuthenticated",
            entrypoint: "./api/isAuthenticated.js",
        },
        { pattern: "/api/kinde/getUser", entrypoint: "./api/getUser.js" },
    ];

    // Loop through each route and inject it into the application
    routes.forEach(({ pattern, entrypoint }) => {
        params.injectRoute({
            pattern,
            entrypoint: resolve(entrypoint),
        });
    });
}

/**
 * Define the Kinde integration with Astro
 */
const kinde = defineIntegration({
    name: "kinde-integration",
    optionsSchema: z.custom<Partial<Config>>().default({}),
    setup({ options, name }) {
        // Create a resolver based on the current module URL
        const { resolve } = createResolver(import.meta.url);

        return {
            hooks: {
                // Setup configuration and middleware during the Astro config phase
                "astro:config:setup": ({ addMiddleware, ...params }) => {
                    // Add virtual imports for configuration merging
                    addVirtualImports(
                        { addMiddleware, ...params },
                        {
                            name,
                            imports: {
                                "virtual:kinde-integration/config": `export default ${JSON.stringify(
                                    { ...defaultConfig, ...options }
                                )}`,
                            },
                        }
                    );

                    // Inject predefined routes into the application
                    injectRoutes(params, resolve);

                    // Add authentication middleware to the application
                    addMiddleware({
                        entrypoint: resolve("./authMiddleware.js"),
                        order: "pre",
                    });
                },
            },
        };
    },
});

export default kinde;
