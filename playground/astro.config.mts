import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

import kinde from "kinde-astro";

export default defineConfig({
	output: "server",
	integrations: [
		tailwind(),
		kinde({
			clientId: import.meta.env.PUBLIC_KINDE_CLIENT_ID,
			domain: import.meta.env.PUBLIC_KINDE_DOMAIN,
			redirectUri: "http://localhost:3000/api/kinde/callback",
			signoutUri: "http://localhost:3000",
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve(
				"../package/dist"
			),
		}),
	],
});
