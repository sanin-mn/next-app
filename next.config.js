// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your configurations here, e.g.,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://globosoft.co.uk/ecommerce-api/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;