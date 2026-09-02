import Image from "next/image";
import Link from "next/link";
export function BrandMark() {
  return (
    <Link href="/" className="inline-flex" aria-label="Woodbay home">
      <Image
        src="/images/woodbay-logo.png"
        alt="Woodbay Decor & Interiors"
        width={1280}
        height={341}
        unoptimized
        priority
        sizes="(max-width: 640px) 168px, 240px"
        className="h-auto w-[10.5rem] object-contain sm:w-60"
        style={{ height: "auto" }}
      />
    </Link>
  );
}
