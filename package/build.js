import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import pkg from "./package.json" assert { type: "json" };
import { copyFileSync } from "fs";

const watch = process.argv.includes("--watch");

const buildOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "esnext",
    outfile: "dist/index.js",
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
        const context = await esbuild.build(buildOptions);
        copyFileSync("src/index.d.ts", "dist/index.d.ts");
        if (watch) {
            console.log("Watching for changes...");
            await context.watch();
        } else {
            console.log("Build completed.");
            process.exit(0);
        }
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

build();
