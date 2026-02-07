import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Empty turbopack config to silence the webpack warning
  // Turbopack handles server-only modules automatically with serverExternalPackages
  turbopack: {},
  // Keep webpack config for backwards compatibility (when using --webpack flag)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Tells Next.js to keep these packages external (server-side only)
  serverExternalPackages: ['opik'],
};

export default nextConfig;
