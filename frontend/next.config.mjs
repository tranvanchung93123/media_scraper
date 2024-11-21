// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Enable static export for `next export`
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/csr-media',
  //       permanent: true, // Use `true` for a 308 Permanent Redirect
  //     },
  //   ];
  // },
};

export default nextConfig;