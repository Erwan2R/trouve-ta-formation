import Image from "next/image";
import logo from "@/public/logo-bicolore.png";

/** Seul asset de marque (PNG 2199×444). `inverse` : blanc sur fond noir. */
export function Logo({
  height,
  inverse = false,
  priority = false,
}: {
  height: number;
  inverse?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="Trouve ta formation"
      priority={priority}
      style={{ height, width: "auto" }}
      sizes={`${Math.ceil((height * 2199) / 444)}px`}
      className={inverse ? "block brightness-0 invert" : "block"}
    />
  );
}
