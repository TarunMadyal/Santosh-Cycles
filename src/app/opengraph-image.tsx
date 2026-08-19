import { ImageResponse } from "next/og";

export const alt = "Santosh Cycles — cycles for every age on MG Road near Head Post Office, Haveri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f5ef",
        color: "#101722",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#1f56d4",
          borderRadius: "34px",
          color: "white",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "62px 70px",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 900, letterSpacing: "-2px" }}>
          SANTOSH CYCLES
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.95 }}>
            Cycles for every age.
          </div>
          <div style={{ color: "#ffde69", display: "flex", fontSize: 32, fontWeight: 700, marginTop: 28 }}>
            MG Road, near Head Post Office, Haveri
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
