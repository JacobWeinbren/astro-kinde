/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		isAuthenticated: boolean;
		accessToken: string | undefined;
	}
}
