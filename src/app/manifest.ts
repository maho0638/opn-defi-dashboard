import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#020617",
    display: "standalone",
    name: "CodeX-Builder OPN DeFi Safety Dashboard",
    orientation: "portrait",
    scope: "/",
    short_name: "CodeX-Builder",
    start_url: "/",
    theme_color: "#020617"
  };
}
