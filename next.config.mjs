// Enable OpenNext Cloudflare context in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [{
      source: '/blog/the-monthly-press-october-2026',
      destination: '/monthly-press/october-2026',
      permanent: true,
    }];
  },
};

export default nextConfig;
