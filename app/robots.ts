import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/test-agent"],
      },
    ],
    sitemap: "https://www.sincroia.lat/sitemap.xml",
  };
}