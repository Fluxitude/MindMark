/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations (FREE)
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: ['@mindmark/ui', '@mindmark/supabase'],
    
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Bundle optimization (FREE)
  webpack: (config, { isServer, dev }) => {
    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Bundle analyzer in development (FREE)
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }

    return config
  },

  // Image optimization (FREE with Next.js)
  images: {
    // Modern image formats for better performance
    formats: ['image/webp', 'image/avif'],
    
    // Allow images from Supabase storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    
    // Cache images for better performance
    minimumCacheTTL: 60,
  },

  // Security settings (FREE)
  poweredByHeader: false, // Hide Next.js version
  
  // Transpile workspace packages
  transpilePackages: ['@mindmark/ui', '@mindmark/supabase'],

  // Enable compression (FREE)
  compress: true,

  // Output optimization for deployment
  output: 'standalone',

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Security headers (FREE protection)
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static files
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for better SEO and UX
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/bookmarks',
        permanent: false,
      },
    ]
  },

  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
