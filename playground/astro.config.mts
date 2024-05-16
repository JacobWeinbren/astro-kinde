import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";
import * as dotenv from "dotenv";
import { initializeKinde } from "./src/kindeClient";

import kinde from "astro-kinde";

dotenv.config();

// Run the Kinde initialization
initializeKinde();

export default defineConfig({
	output: "server",
	integrations: [
		tailwind(),
		kinde({
			clientId: process.env.PUBLIC_KINDE_CLIENT_ID,
			clientSecret: process.env.PUBLIC_KINDE_CLIENT_SECRET,
			domain: process.env.PUBLIC_KINDE_DOMAIN,
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
