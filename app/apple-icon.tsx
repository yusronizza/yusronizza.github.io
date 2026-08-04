import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#c00020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontSize: 80,
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          YIF
        </span>
      </div>
    ),
    { ...size }
  );
}
