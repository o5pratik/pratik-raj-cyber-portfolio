import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGitHubPages ? "/pratik-raj-cyber-portfolio" : "",
  assetPrefix: isGitHubPages ? "/pratik-raj-cyber-portfolio/" : undefined,
};
export default nextConfig;
