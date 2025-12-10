/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize memory usage during build
  swcMinify: true,
  
  // Webpack optimizations for build performance
  webpack: (config, { isServer, dev }) => {
    // Only optimize for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk - separate large libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk - shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // TypeScript configuration - skip type checking during build for faster builds
  // Set SKIP_TYPE_CHECK=true to skip type checking if memory constrained
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  
  // ESLint configuration - skip linting during build for faster builds
  // Set SKIP_LINT=true to skip linting if memory constrained
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },
};

module.exports = nextConfig;
