import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jenn's notebooks",
    short_name: "Jenn",
    description: "Handmade leather traveler's notebooks. Make yours.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f7f3ec",
    theme_color: "#f7f3ec",
  };
}
