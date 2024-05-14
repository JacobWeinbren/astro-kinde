import {
    defineIntegration,
    addVirtualImports,
    addDts,
    createResolver,
} from "astro-integration-kit";
import { z } from "zod";

const defaultConfig = {
    clientId: "",
    domain: "",
    redirectUri: "",
    signoutUri: "",
    responseType: "code",
    scope: "openid email profile offline",
};

export default defineIntegration({
    name: "kinde-integration",
    optionsSchema: z.object({
        clientId: z.string(),
        domain: z.string(),
        redirectUri: z.string(),
        responseType: z.string().optional(),
        scope: z.string().optional(),
    }),
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

                    addDts(params, {
                        name: "kinde-integration",
                        content: `declare module "virtual:kinde-integration/config" {
                            export interface Config {
                                clientId: string;
                                domain: string;
                                redirectUri: string;
                                signoutUri: string;
                                responseType?: string;
                                scope?: string;
                            }
                            const config: Config;
                            export default config;
                        }`,
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
                        pattern: "/api/introspect",
                        entrypoint: resolve("./api/introspect.ts"),
                    });
                },
            },
        };
    },
});
