import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only Vercel's Next.js preview uses this scoped typecheck; the production
  // Cloudflare/vinext runtime retains the original project TypeScript settings.
  ...(process.env.VERCEL
    ? { typescript: { tsconfigPath: "tsconfig.vercel.json" } }
    : {}),
};

export default nextConfig;
