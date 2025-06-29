// next.config.js

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  // adjust path if yours differs
  localePath: './src/i18n.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1) Disable TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2) Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '8fpa87ovv8.ufs.sh' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
