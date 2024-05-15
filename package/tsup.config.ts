/// <reference types="node" />
import { defineConfig } from "tsup";

export default defineConfig({
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
    minify: true,
    dts: true,
    watch: process.argv.includes("--watch"),
    external: [
        ...Object.keys(require("./package.json").peerDependencies),
        "virtual:kinde-integration/config",
        "virtual:image-service",
    ],
});
