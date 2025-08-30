/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compiler: { styledComponents: false },
  eslint: { ignoreDuringBuilds: true },

  webpack(config) {
    // allow "@/..." absolute imports
    config.resolve.alias['@'] = require('path').resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
