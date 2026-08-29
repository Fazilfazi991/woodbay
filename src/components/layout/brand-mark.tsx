import Image from "next/image";
import Link from "next/link";
export function BrandMark() {
  return (
    <Link href="/" className="inline-flex" aria-label="Woodbay home">
      <Image
        src="/images/woodbay-logo.png"
        alt="Woodbay Decor & Interiors"
        width={256}
        height={64}
        sizes="(max-width: 640px) 176px, 240px"
        className="h-auto w-44 object-contain sm:w-60"
        style={{ height: "auto" }}
      />
    </Link>
  );
}
