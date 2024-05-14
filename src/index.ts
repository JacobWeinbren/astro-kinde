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

                    params.injectRoute({
                        pattern: "/api/login",
                        entrypoint: resolve("./api/login.ts"),
                    });
                    params.injectRoute({
                        pattern: "/api/register",
                        entrypoint: resolve("./api/register.ts"),
                    });
                    params.injectRoute({
                        pattern: "/api/callback",
                        entrypoint: resolve("./api/callback.ts"),
                    });
                    params.injectRoute({
                        pattern: "/api/signout",
                        entrypoint: resolve("./api/signout.ts"),
                    });
                    params.injectRoute({
                        pattern: "/api/isAuthenticated",
                        entrypoint: resolve("./api/isAuthenticated.ts"),
                    });
                    params.injectRoute({
                        pattern: "/api/getUser",
                        entrypoint: resolve("./api/getUser.ts"),
                    });
                },
            },
        };
    },
});
