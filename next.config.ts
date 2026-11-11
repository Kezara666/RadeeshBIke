import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Dev only: lets phones reach the dev server through an ngrok tunnel.
  // Without this, Next blocks the page's JavaScript, so buttons stop working.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
