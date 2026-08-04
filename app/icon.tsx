import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#c00020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: -0.5,
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
