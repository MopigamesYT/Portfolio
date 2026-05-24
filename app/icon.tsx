import { ImageResponse } from "next/og";
import { fetchDiscordProfile } from "./lib/lanyard";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const revalidate = 300;

export default async function Icon() {
  const { avatar } = await fetchDiscordProfile();

  if (!avatar) {
    return new ImageResponse(
      <div
        style={{
          width: 64, height: 64,
          background: "#cba6f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          fontSize: 26,
          fontWeight: 700,
          color: "#1e1e2e",
        }}
      >
        MP
      </div>,
      size
    );
  }

  const smallUrl = avatar.replace("size=512", "size=64");
  const res  = await fetch(smallUrl);
  const buf  = await res.arrayBuffer();
  const mime = res.headers.get("content-type") ?? "image/png";
  const src  = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: 64, height: 64,
        borderRadius: 14,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />,
    size
  );
}
