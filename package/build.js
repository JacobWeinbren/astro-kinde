import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import pkg from "./package.json" assert { type: "json" };
import { copyFileSync } from "fs";

const watch = process.argv.includes("--watch");

const buildOptions = {
    entryPoints: [
        "src/index.ts",
        "src/api/login.ts",
        "src/api/register.ts",
        "src/api/callback.ts",
        "src/api/signout.ts",
        "src/api/isAuthenticated.ts",
        "src/api/getUser.ts",
    ],
    bundle: true,
    platform: "node",
    target: "esnext",
    outdir: "dist",
    sourcemap: true,
    minify: true,
    format: "esm",
    external: [
        ...Object.keys(pkg.peerDependencies),
        "virtual:kinde-integration/config",
        "virtual:image-service",
    ],
    plugins: [nodeExternalsPlugin()],
};

async function build() {
    try {
        const context = await esbuild.context(buildOptions);
        copyFileSync("src/index.d.ts", "dist/index.d.ts");
        if (watch) {
            console.log("Watching for changes...");
            await context.watch();
        } else {
            await context.rebuild();
            console.log("Build completed.");
            process.exit(0);
        }
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

build();
