import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import pkg from "./package.json" assert { type: "json" };
import { copyFileSync } from "fs";

esbuild
    .build({
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
    })
    .then(() => {
        copyFileSync("src/index.d.ts", "dist/index.d.ts");
    })
    .catch(() => process.exit(1));
