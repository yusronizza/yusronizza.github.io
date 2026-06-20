import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";
import { profile } from "@/lib/data/profile";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#090907",
          color: "#f3f1e7",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#f0a830",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {`// ${profile.title}`}
        </div>
        <div style={{ fontSize: 72, fontWeight: 600, marginTop: 24, lineHeight: 1.1, fontFamily: "sans-serif" }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 30, color: "#8e8c7c", marginTop: 28, fontFamily: "sans-serif" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
