/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Notion file/cover URLs (S3 + unsplash). Loosen as needed.
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.notion.so' },
    ],
  },
};

module.exports = nextConfig;
