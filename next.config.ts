import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // GitHub Actions keeps the Pages export; Vercel uses the server runtime for API routes.
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/pratik-raj-cyber-portfolio" : "",
  assetPrefix: isGitHubPages ? "/pratik-raj-cyber-portfolio/" : undefined,
  env: { NEXT_PUBLIC_ASSET_PREFIX: isGitHubPages ? "/pratik-raj-cyber-portfolio" : "" },
};
export default nextConfig;
