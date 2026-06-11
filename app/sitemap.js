/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return [
    {
      url: "https://qris.zeranel.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
