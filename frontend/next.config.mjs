/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    USER_SERVICE_URL: process.env.USER_SERVICE_URL
  }
};

export default nextConfig;
