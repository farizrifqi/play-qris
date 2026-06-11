/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return [
    {
      url: "https://play-qris.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
