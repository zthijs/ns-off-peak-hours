import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/constants/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NS Dal-uren",
    short_name: "Dal-uren",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#003082",
    theme_color: "#003082",
    lang: "nl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
