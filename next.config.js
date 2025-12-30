/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        canvas: false,
      }
    }
    
    // Ignore canvas and other Node.js modules
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }
    
    return config
  },
}

module.exports = nextConfig

