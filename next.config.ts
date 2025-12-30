import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/flashcard-app/study-mode',
  assetPrefix: '/flashcard-app'

};

module.exports = nextConfig;
export default nextConfig;
