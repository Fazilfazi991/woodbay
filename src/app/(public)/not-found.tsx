import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section tone="dark" className="grid min-h-[65vh] place-items-center">
      <Container className="max-w-3xl text-center">
        <Compass
          size={28}
          strokeWidth={1.2}
          className="mx-auto text-[color:var(--gold)]"
        />
        <Eyebrow>404 · Not found</Eyebrow>
        <h1 className="font-display mt-5 text-5xl leading-none sm:text-6xl">
          This space is not available.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          The page may have moved, or the link may no longer be active. Continue
          exploring Woodbay from one of these routes.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button>
              Home <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">Products</Button>
          </Link>
          <Link href="/dealers">
            <Button variant="secondary">Find a dealer</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
