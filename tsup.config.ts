import { defineConfig } from "tsup";
import type { Options } from "tsup";
console.log("s", process.env.NODE_ENV, String(process.env.NODE_ENV === ""));
export default defineConfig((options) => {
  const common: Options = {
    minify: !options.watch, // 除了dev都压缩
    splitting: false,
    sourcemap: true,
    bundle: true,
    clean: true,
    format: ["cjs", "esm"],
    external: [],
    noExternal: [],
    platform: "browser",
    dts: true,
    define: {
      __DEV__: String(process.env.NODE_ENV === ""),
    },
  };

  return [{ ...common, entry: ["./src/index.tsx"], outDir: "./dist" }];
});
