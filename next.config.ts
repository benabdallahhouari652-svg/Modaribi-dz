import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable RSC cache components to fix Suspense hanging bug in Next.js 16
  // https://github.com/vercel/next.js/issues/85162
  cacheComponents: false,

  // Prisma + bcrypt need Node.js runtime, not Edge
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
