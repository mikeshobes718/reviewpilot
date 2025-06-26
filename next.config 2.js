/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true
  },
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  // allow your LAN IP(s) for Dev:
  allowedDevOrigins: ['http://192.168.1.43:3001']
}

module.exports = nextConfig
