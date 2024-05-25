/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    if (dev) {
      config.devtool = "eval-source-map"; // Utilisez un type de sourcemap plus performant
    }
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
