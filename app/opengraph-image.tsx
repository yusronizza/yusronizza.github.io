import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";
import { getProfile } from "@/lib/api/profile";

export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let title: string = siteConfig.defaultTitle;
  let tagline: string = siteConfig.description;

  try {
    const profile = await getProfile();
    title = profile.title;
    tagline = profile.tagline;
  } catch {
    // fall through to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: siteConfig.themeColor,
          color: "#eeeeee",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#ff3344",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {`// ${title}`}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            marginTop: 24,
            lineHeight: 1.1,
            fontFamily: "sans-serif",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#888888",
            marginTop: 28,
            fontFamily: "sans-serif",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
