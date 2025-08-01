/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations (FREE)
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: ['@mindmark/ui', '@mindmark/supabase'],

    // Enable optimized CSS loading
    optimizeCss: true,

    // Optimize font loading
    optimizeServerReact: true,
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@supabase/supabase-js'],

  // Turbopack configuration (now stable!)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
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
      {
        // Cache API routes with shorter TTL
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        // Preload critical resources
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '</fonts/geist-sans.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
          },
        ],
      },
    ]
  },

  // Redirects for better SEO and UX
  async redirects() {
    return [
      // Removed dashboard redirect - dashboard page exists at /dashboard
      // {
      //   source: '/dashboard',
      //   destination: '/dashboard/bookmarks',
      //   permanent: false,
      // },
    ]
  },

  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
