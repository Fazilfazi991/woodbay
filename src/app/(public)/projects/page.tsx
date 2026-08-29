import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/layout/primitives";
import { getPublishedProjects } from "@/features/projects/data";

function projectImage(
  project: Awaited<ReturnType<typeof getPublishedProjects>>[number],
) {
  const gallery = [...(project.project_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const src = project.featured_image || gallery[0]?.storage_key;
  return src && (src.startsWith("http") || src.startsWith("/")) ? src : null;
}

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getPublishedProjects>> = [];
  let unavailable = false;

  try {
    projects = await getPublishedProjects();
  } catch {
    unavailable = true;
  }

  return (
    <Section tone="dark" className="!py-12 sm:!py-16 lg:!py-20">
      <Container>
        <SectionHeader
          as="h1"
          eyebrow="Our Projects"
          title="Spaces made personal."
          description="Explore published Woodbay project work from the canonical gallery."
        />

        {unavailable ? (
          <p className="mt-8 max-w-2xl border border-[color:var(--border-dark)] p-5 text-sm text-[color:var(--muted)]">
            Projects are temporarily unavailable. Please try again shortly.
          </p>
        ) : projects.length === 0 ? (
          <p className="mt-8 max-w-2xl border border-[color:var(--border-dark)] p-5 text-sm text-[color:var(--muted)]">
            No projects are available yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const image = projectImage(project);
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden border border-[color:var(--border-dark)] bg-[color:var(--surface-dark)]"
                >
                  <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_20%,#48483f,transparent_68%),#252620]">
                    {image ? (
                      <Image
                        src={image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Eyebrow>{project.category}</Eyebrow>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                      {project.category}
                      {project.location ? ` · ${project.location}` : ""}
                    </p>
                    <h2 className="font-display mt-3 text-4xl leading-none">
                      {project.title}
                    </h2>
                    {project.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                        {project.description}
                      </p>
                    )}
                    <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-bold tracking-[.12em] text-[color:var(--gold)] uppercase">
                      View Project <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
