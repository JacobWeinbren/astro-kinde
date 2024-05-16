/// <reference types="node" />
import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";

export default defineConfig((options) => {
    const dev = !!options.watch;

    return {
        entry: [
            "src/index.ts",
            "src/authMiddleware.ts",
            "src/getUserData.ts",
            "src/api/login.ts",
            "src/api/register.ts",
            "src/api/callback.ts",
            "src/api/signout.ts",
            "src/api/isAuthenticated.ts",
            "src/api/getUser.ts",
        ],
        outDir: "dist",
        format: ["esm"],
        sourcemap: true,
        minify: !dev,
        clean: true,
        dts: true,
        splitting: false,
        target: 'node18',
        watch: process.argv.includes("--watch"),
        external: [
            ...Object.keys(peerDependencies),
            "virtual:kinde-integration/config",
            "virtual:image-service",
        ],
    }
});
