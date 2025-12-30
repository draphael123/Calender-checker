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
    } else {
      // For server-side, ignore canvas
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      }
    }
    
    // Ignore canvas module
    config.externals = config.externals || []
    config.externals.push({
      canvas: 'canvas',
    })
    
    return config
  },
}

module.exports = nextConfig

