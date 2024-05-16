import { init } from "@kinde/management-api-js";

// Initialize the SDK
export function initializeKinde() {
	init({
		domain: process.env.PUBLIC_KINDE_DOMAIN,
		clientId: process.env.PUBLIC_KINDE_CLIENT_ID,
		clientSecret: process.env.PUBLIC_KINDE_CLIENT_SECRET,
	});
}
