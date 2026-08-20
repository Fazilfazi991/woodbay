import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container, CTASection, Eyebrow, Section } from "@/components/layout/primitives";
import { getPublishedProject } from "@/features/projects/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function canPreview(src: string | null | undefined) {
  return Boolean(src && (src.startsWith("http") || src.startsWith("/")));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  const gallery = [...(project.project_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const heroImage = canPreview(project.featured_image) ? project.featured_image : canPreview(gallery[0]?.storage_key) ? gallery[0]?.storage_key : null;

  return (
    <>
      <Section tone="dark" className="pt-10">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-xs tracking-[.1em] text-[color:var(--muted)] uppercase">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/projects">Projects</Link>
            <span>/</span>
            <span className="text-[color:var(--foreground-light)]">{project.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <Eyebrow>
                {project.category}
                {project.location ? ` · ${project.location}` : ""}
              </Eyebrow>
              <h1 className="font-display mt-4 text-5xl leading-none sm:text-6xl">{project.title}</h1>
              {project.description && (
                <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
                  {project.description}
                </p>
              )}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase lg:justify-self-end"
            >
              Discuss a Project <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 overflow-hidden border border-[color:var(--border-gold)]">
            <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_50%_20%,#48483f,transparent_68%),#252620]">
              {heroImage ? (
                <Image src={heroImage} alt={project.title} fill sizes="100vw" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center">
                  <span className="font-display text-4xl tracking-[.12em] text-[color:var(--gold)]">WOODBAY</span>
                </div>
              )}
            </div>
          </div>

          {gallery.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden border border-[color:var(--border-dark)] bg-[color:var(--surface-dark)]">
                  {canPreview(image.storage_key) ? (
                    <Image
                      src={image.storage_key}
                      alt={image.alt_text ?? project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">Project image</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
      <CTASection
        title="Planning a Woodbay space?"
        description="Share your project requirements with the Woodbay team."
        action={{ label: "Contact Woodbay", href: "/contact" }}
      />
    </>
  );
}
