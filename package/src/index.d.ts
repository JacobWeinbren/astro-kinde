import { Config } from "./types";

declare module "astro-kinde" {
    export function defineIntegration(config: any): any;
    export function addVirtualImports(params: any, options: any): void;
    export function createResolver(url: string): {
        resolve: (path: string) => string;
    };
    export const defaultConfig: Partial<Config>;
    export function injectRoutes(
        params: any,
        resolve: (path: string) => string
    ): void;
    export function getUserData(params: any): any;
    export default function kinde(config: Partial<Config>): any;
}
