import { defineConfig } from "vite";
import { hydrogen } from "@shopify/hydrogen/vite";
import { oxygen } from "@shopify/mini-oxygen/vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: ["keen-slider/react", "typographic-base/index", "textr"],
    },
  },
  server: {
    warmup: {
      clientFiles: [
        "./app/entry.client.tsx",
        "./app/root.tsx",
        "./app/routes/**/*",
      ],
    },
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
});
