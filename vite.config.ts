import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import html from "@tomjs/vite-plugin-html";
import postcsspxtoviewport from "postcss-px-to-viewport";
import postcssPresetEnv from "postcss-preset-env";

export default defineConfig({
  base: "/inter-knot/",
  server: {
    host: "0.0.0.0",
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({ viewportWidth: 1280 }),
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
