import {
    defineIntegration,
    addVirtualImports,
    createResolver,
} from "astro-integration-kit";
import { z } from "zod";
import type { Config } from "./types.js";

const defaultConfig = {
    clientId: "",
    domain: "",
    redirectUri: "",
    signoutUri: "",
    responseType: "code",
    scope: "openid email profile offline",
} satisfies Partial<Config>;

function injectRoutes(params: any, resolve: (path: string) => string) {
    const routes = [
        { pattern: "/api/auth/login", entrypoint: "./api/login.ts" },
        { pattern: "/api/auth/register", entrypoint: "./api/register.ts" },
        { pattern: "/api/auth/callback", entrypoint: "./api/callback.ts" },
        { pattern: "/api/auth/signout", entrypoint: "./api/signout.ts" },
        {
            pattern: "/api/auth/isAuthenticated",
            entrypoint: "./api/isAuthenticated.ts",
        },
        { pattern: "/api/auth/getUser", entrypoint: "./api/getUser.ts" },
    ];

    routes.forEach(({ pattern, entrypoint }) => {
        params.injectRoute({
            pattern,
            entrypoint: resolve(entrypoint),
        });
    });
}

export default defineIntegration({
    name: "kinde-integration",
    optionsSchema: z.custom<Partial<Config>>().default({}),
    setup({ options, name }) {
        const { resolve } = createResolver(import.meta.url);
        return {
            hooks: {
                "astro:config:setup": (params) => {
                    addVirtualImports(params, {
                        name,
                        imports: {
                            "virtual:kinde-integration/config": `export default ${JSON.stringify(
                                { ...defaultConfig, ...options }
                            )}`,
                        },
                    });

                    injectRoutes(params, resolve);
                },
            },
        };
    },
});
