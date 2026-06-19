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
          backgroundColor: "#0a0a0c",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#818cf8",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {profile.title}
        </div>
        <div style={{ fontSize: 72, fontWeight: 600, marginTop: 24, lineHeight: 1.1 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 28 }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
