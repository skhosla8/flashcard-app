import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/flashcard-app',
  assetPrefix: '/flashcard-app'

};

module.exports = nextConfig;
export default nextConfig;
