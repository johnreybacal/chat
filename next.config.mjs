/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: "/chat",
  images: {
    unoptimized: true,
  },
  distDir: "./out"
};

export default nextConfig;
