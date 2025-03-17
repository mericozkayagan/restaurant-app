/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Handle TypeScript errors in development
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Only apply these fallbacks for client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Core Node.js modules
        "aws-sdk": false,
        "mock-aws-s3": false,
        nock: false,
        fs: false,
        path: false,
        os: false,
        util: false,
        crypto: false,
        stream: false,
        url: false,
        net: false,
        tls: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        child_process: false,

        // MSW interceptors
        "@mswjs/interceptors/presets/node": false,
        "@mswjs/interceptors": false,

        // Node-pre-gyp related
        "node-gyp": false,
        npm: false,

        // Other problematic modules
        bcrypt: false,
        encoding: false,
      };
    }

    // Add a rule to handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: "file-loader",
      include: /node_modules/,
    });

    return config;
  },
  // Configure Turbopack properly
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

module.exports = nextConfig;
