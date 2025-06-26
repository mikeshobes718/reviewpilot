/** @type {import('next').NextConfig} */
const nextConfig = {
  // disable the old experimental.turbo flag
  experimental: { turbo: false },
  // allow imports like "@/lib/whatever"
  compiler: {
    styledComponents: false,
  },
  eslint: { ignoreDuringBuilds: true },
  // map @/* -> ./src/*
  webpack(config) {
    config.resolve.alias["@" ] = require("path").resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
