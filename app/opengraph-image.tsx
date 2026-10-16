import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "BGM Exports — certified diamonds, exported with integrity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card: white logo on brand navy with a soft blue glow.
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public/images/logo-white.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 45%, #1f4fd8 0%, #0f2a52 55%, #0a1c38 100%)",
        }}
      >
        <img src={src} width={560} height={198} alt="" />
        <div style={{ marginTop: 40, fontSize: 36, color: "#dce8fa", letterSpacing: 2 }}>{SITE.tagline}</div>
      </div>
    ),
    size,
  );
}
