import { defineIntegration } from "astro-integration-kit";
import { createAuthUrl } from "./urls.js";

interface KindeConfig {
    clientId: string;
    domain: string;
    redirectUri: string;
    responseType?: string;
    scope?: string;
}

export default function createKindeIntegration(config: KindeConfig) {
    const fullConfig = {
        ...config,
        responseType: config.responseType || "code",
        scope: config.scope || "openid email profile offline",
    };

    return defineIntegration({
        name: "kinde-integration",
        setup() {
            const authUrl = createAuthUrl(fullConfig);
            return {
                hooks: {},
            };
        },
    });
}
