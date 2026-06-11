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
    sitemap: "https://qris.zeranel.dev/sitemap.xml",
    host: "https://qris.zeranel.dev",
  };
}
