// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/csr-media',
        permanent: true, // Use `true` for a 308 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
