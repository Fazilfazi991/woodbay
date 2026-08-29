import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button, type ButtonVariant } from "@/components/ui/button";
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-14 ${className}`}
    >
      {children}
    </div>
  );
}
export function Section({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light" | "muted";
  className?: string;
}) {
  const surface =
    tone === "dark"
      ? "woodbay-dark-section bg-[color:var(--background-dark)] text-[color:var(--foreground-light)]"
      : tone === "muted"
        ? "woodbay-light-section bg-[color:var(--surface-muted)] text-[color:var(--foreground-dark)]"
        : "woodbay-light-section bg-[color:var(--surface-light)] text-[color:var(--foreground-dark)]";
  return (
    <section
      className={`py-12 sm:py-16 md:py-20 lg:py-28 ${surface} ${className}`}
    >
      {children}
    </section>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[.18em] text-[color:var(--gold)] uppercase">
      {children}
    </p>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading className="font-display mt-3 max-w-[18ch] text-4xl leading-[1.02] sm:text-5xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-5 max-w-[68ch] text-sm leading-7 text-[color:var(--muted-dark)]">
          {description}
        </p>
      )}
    </div>
  );
}
export function Divider() {
  return <div className="h-px w-full bg-[color:var(--border-gold)]" />;
}
export function FeatureItem({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[color:var(--border-gold)] py-6">
      <Icon size={21} strokeWidth={1.25} className="text-[color:var(--gold)]" />
      <h3 className="mt-5 text-sm font-bold tracking-[.12em] uppercase">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
        {children}
      </p>
    </div>
  );
}
export function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-[color:var(--border-gold)] pl-5">
      <p className="font-display text-4xl text-[color:var(--gold)] sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 max-w-36 text-xs leading-5 tracking-[.1em] text-[color:var(--muted)] uppercase">
        {label}
      </p>
    </div>
  );
}
export function ImageCard({
  src,
  alt,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden border border-[color:var(--border-dark)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      {children && (
        <div className="relative z-10 flex min-h-72 items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-6">
          {children}
        </div>
      )}
    </div>
  );
}
export function ProductCategoryCard({
  title,
  mobileTitle,
  href,
  image,
  imageClassName = "",
  containImageOnMobile = false,
  eyebrow,
  description,
  mobileDescription,
  tone = "dark",
}: {
  title: string;
  mobileTitle?: string;
  href: string;
  image: string;
  imageClassName?: string;
  containImageOnMobile?: boolean;
  eyebrow?: string;
  description?: string;
  mobileDescription?: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={`group block overflow-hidden border transition-[border-color,background-color] duration-300 ${dark ? "border-[color:var(--border-dark)] bg-[color:var(--surface-dark)] text-[color:var(--foreground-light)]" : "border-[color:var(--border-light)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground-dark)] hover:border-[color:var(--gold)]"}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-white sm:aspect-[4/3]">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className={`${containImageOnMobile ? "object-contain sm:object-cover" : "object-cover"} transition duration-500 group-hover:scale-[1.025] ${imageClassName}`}
        />
      </div>
      <div className="p-5 sm:p-6">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.75rem] leading-[1.02] sm:text-3xl">
            <span className="sm:hidden">{mobileTitle ?? title}</span>
            <span className="hidden sm:inline">{title}</span>
          </h3>
          <ArrowRight
            size={20}
            className="mt-1 hidden shrink-0 text-[color:var(--gold)] transition-transform group-hover:translate-x-1 sm:block"
            strokeWidth={1.25}
          />
        </div>
        {(description || mobileDescription) && (
          <p
            className={`mt-3 text-sm leading-6 ${dark ? "text-[color:var(--muted)]" : "text-[color:var(--muted-dark)]"}`}
          >
            <span className="sm:hidden">
              {mobileDescription ?? description}
            </span>
            <span className="hidden sm:inline">{description}</span>
          </p>
        )}
        <span className="mt-4 flex min-h-11 w-full items-center justify-center text-xs font-bold tracking-[.12em] uppercase sm:hidden">
          Explore{" "}
          <ArrowRight size={15} className="ml-2 text-[color:var(--gold)]" />
        </span>
      </div>
    </Link>
  );
}
export function Breadcrumb({
  items,
}: {
  items: readonly { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2 text-xs text-[#c6c0b5]">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-[color:var(--gold)]">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="hover:text-[color:var(--gold)]">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumb,
  cta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  breadcrumb?: readonly { label: string; href?: string }[];
  cta?: { label: string; href: string; variant?: ButtonVariant };
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 z-10 bg-black/50" />
      <Container className="relative z-20 py-12 sm:py-20 md:py-28 lg:py-36">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <div className="mt-8 max-w-3xl sm:mt-14">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="font-display mt-4 text-[2.5rem] leading-[.94] whitespace-pre-line sm:text-[4.5rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-[15px] leading-7 sm:mt-6 sm:text-base">
              {description}
            </p>
          )}
          {cta && (
            <Link href={cta.href} className="mt-7 inline-block sm:mt-8">
              <Button variant={cta.variant}>
                {cta.label}
                <ArrowRight size={15} />
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
export function CTASection({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: { label: string; href: string };
}) {
  return (
    <Section tone="dark">
      <Container>
        <div className="border-y border-[color:var(--border-gold)] py-12 text-center">
          <Eyebrow>Woodbay</Eyebrow>
          <h2 className="font-display mt-4 text-4xl sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
            {description}
          </p>
          <Link href={action.href} className="mt-7 inline-block">
            <Button className="h-13 !px-5 py-0 !text-[13px] !tracking-[.08em] sm:h-auto sm:!px-6 sm:py-3 sm:!text-[11px] sm:!tracking-[.14em]">
              {action.label}
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
