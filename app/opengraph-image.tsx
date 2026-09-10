import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Żółte logo BeeMiodzio na beżowym tle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "inspo/logo.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F0E5",
        }}
      >
        <img
          src={`data:image/png;base64,${logo}`}
          width={510}
          height={510}
          alt="BeeMiodzio"
        />
      </div>
    ),
    size,
  );
}
