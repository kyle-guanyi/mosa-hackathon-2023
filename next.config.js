/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "founding-friends-pre-signed-url-images.s3.us-west-1.amazonaws.com",
      "i.imgur.com",
    ],
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

module.exports = nextConfig;
