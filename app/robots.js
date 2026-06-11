/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/_next/*"],
      },
    ],
    sitemap: "https://play-qris.vercel.app/sitemap.xml",
    host: "https://play-qris.vercel.app",
  };
}
