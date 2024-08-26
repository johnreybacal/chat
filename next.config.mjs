/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: "/chat",
  images: {
    unoptimized: true,
  },
  distDir: "out",
  env: {
    SOCKET_URL: process.env.SOCKET_URL,
  }

};

export default nextConfig;
