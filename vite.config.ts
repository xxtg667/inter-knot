import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import html from "@tomjs/vite-plugin-html";
import postcsspxtoviewport from "postcss-px-to-viewport";
import postcssPresetEnv from "postcss-preset-env";

export default defineConfig({
  base: "/",
  server: {
    host: "0.0.0.0",
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({ viewportWidth: 1536 }),
        postcssPresetEnv({
          browsers: [">= 0%"],
          features: {
            "nesting-rules": [
              "auto",
              {
                edition: "2024-02",
              },
            ],
          },
        }),
      ],
    },
  },
  plugins: [html({ minify: true }), viteCompression({ threshold: 0 })],
});
