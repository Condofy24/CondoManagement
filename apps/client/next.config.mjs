/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    KNOCK_PUBLIC_API_KEY: process.env.KNOCK_PUBLIC_API_KEY,
    KNOCK_FEED_CHANNEL_ID: process.env.KNOCK_FEED_CHANNEL_ID,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dzu5t20lr/**",
      },
    ],
  },
};

export default nextConfig;
