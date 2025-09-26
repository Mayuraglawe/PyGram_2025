/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_PUBLIC_BUILDER_KEY: process.env.VITE_PUBLIC_BUILDER_KEY,
    PING_MESSAGE: process.env.PING_MESSAGE,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_PRINCIPAL_CHAT_ID: process.env.TELEGRAM_PRINCIPAL_CHAT_ID,
    TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}

export default nextConfig;