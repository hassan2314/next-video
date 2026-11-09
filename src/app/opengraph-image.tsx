import { ImageResponse } from "next/og";

export const alt = "Next Video — watch and share videos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "rgba(255,255,255,0.14)",
            marginBottom: 32,
            fontSize: 42,
          }}
        >
          ▶
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>
          Next Video
        </div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.92 }}>
          Watch and share videos
        </div>
      </div>
    ),
    { ...size }
  );
}
