/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL_SSR:process.env.NEXT_PUBLIC_API_URL_SSR,
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/landing",
  //       basePath: false,
  //       permanent: false,
  //     },
  //   ];
  // },
}

module.exports = nextConfig
