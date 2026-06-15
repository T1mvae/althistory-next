/** @type {import('next').NextConfig} */

// GitHub Pages serves a fully static build (next export) from a repo subpath:
//   https://<user>.github.io/althistory-next/
// CI sets BUILD_TARGET=export to turn that on. Local `npm run dev` and any
// server host (e.g. Vercel) keep the normal dynamic behaviour.
const isExport = process.env.BUILD_TARGET === 'export';
const repo = 'althistory-next';

const nextConfig = {
  images: {
    // The next/image optimizer needs a server; static export must skip it.
    unoptimized: isExport,
    // Notion file/cover URLs (S3 + unsplash). Loosen as needed.
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.notion.so' },
    ],
  },
  ...(isExport
    ? {
        output: 'export',
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;
