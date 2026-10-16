import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f2a52" }}>
        <svg width="128" height="128" viewBox="0 0 32 32" fill="none">
          <path d="M8 6h16l5 7-13 14L3 13z" fill="#3b82f0" />
          <path d="M8 6h16l5 7-13 14L3 13z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M3 13h26M12 13l4 14 4-14M12 13l-4-7M20 13l4-7M12 13l4-7 4 7" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
