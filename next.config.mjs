/** @type {import('next').NextConfig} */
const nextConfig = {
  // needed for next/image src as we are pulling images from outside providers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
};

export default nextConfig;
