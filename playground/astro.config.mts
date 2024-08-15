import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";
import * as dotenv from "dotenv";
import { init } from "@kinde/management-api-js";

import kinde from "astro-kinde";

dotenv.config();

// Run the Kinde initialisation
init();

export default defineConfig({
	output: "server",
	integrations: [
		tailwind(),
		kinde({
			clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID,
			clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET,
			domain: process.env.KINDE_DOMAIN,
			callbackUri: "http://localhost:4321/api/kinde/callback",
			signedInUri: "http://localhost:4321",
			signedOutUri: "http://localhost:4321",
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve(
				"../package/dist"
			),
		}),
	],
});
