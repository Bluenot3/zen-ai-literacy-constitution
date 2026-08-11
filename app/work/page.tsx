import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import { listPublications } from "./content.server";
import styles from "./work.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public Work",
  description:
    "Published accomplishments, partnerships, initiatives, and public knowledge from ZEN AI Co.",
};

const labels = {
  accomplishments: "Accomplishments",
  partners: "Partners",
  initiatives: "Initiatives",
  knowledge: "Public knowledge",
} as const;

const FOUNDATIONAL_RECORD = [
  {
    category: "accomplishments",
    title: "AI Pioneer: the founding public record",
    summary:
      "Open the preserved dossier, source artifacts, proof metadata, and independent verification routes for ZEN's youth AI literacy work.",
    href: "/legacy-dossier",
  },
  {
    category: "accomplishments",
    title: "2026 Presidential AI Challenge recognition",
    summary:
      "View the commemorative recognition record displayed by ZEN in connection with the 2026 Presidential AI Challenge.",
    href: "/presidential-ai-challenge-recognition.png",
  },
  {
    category: "initiatives",
    title: "AI Literacy Constitution",
    summary:
      "Read the public principles anchoring ZEN's approach to AI literacy, human agency, practical capability, and responsible advancement.",
    href: "/ai-literacy-constitution",
  },
  {
    category: "partners",
    title: "Build or partner with ZEN",
    summary:
      "Use the guided intake to route a school, community, organization, program, or strategic collaboration with the right context.",
    href: "/start",
  },
  {
    category: "knowledge",
    title: "ZEN Legacy Dossier",
    summary:
      "Review the durable public archive, machine-readable proof, timestamp record, and verification sources behind the program record.",
    href: "/legacy-dossier",
  },
] as const;

export default async function WorkIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const requestedCategory = (await searchParams).category;
  const publications = await listPublications();
  const category =
    requestedCategory && requestedCategory in labels
      ? (requestedCategory as keyof typeof labels)
      : null;
  const visible = category
    ? publications.filter(
        (publication) => publication.document.listing.category === category,
      )
    : publications;
  const foundationalVisible = category
    ? FOUNDATIONAL_RECORD.filter((record) => record.category === category)
    : FOUNDATIONAL_RECORD;

  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="archive" />
      <TreasuryPageFrame chapter="PUBLIC RECORD / 01" serial="ZEN-WORK-MMXXVI" />
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI World home">
          <Image src="/zen-mark.png" alt="" width={34} height={34} unoptimized />
          <strong>ZEN AI Co.</strong>
        </Link>
        <nav aria-label="Page navigation">
          <Link href="/">Home</Link>
          <a href="https://arsenal.world">Enter Arsenal ↗</a>
        </nav>
      </header>

      <section className={styles.page}>
        <header className={styles.hero}>
          <p>Public record</p>
          <h1>{category ? labels[category] : "Work made visible."}</h1>
          <div>
            Explore the accomplishments, collaborations, initiatives, and
            ideas shaping ZEN AI Co.—with the context behind each one.
          </div>
        </header>

        <nav className="work-filter" aria-label="Filter public work">
          <Link data-active={!category} href="/work">
            All
          </Link>
          {Object.entries(labels).map(([key, label]) => (
            <Link
              data-active={category === key}
              href={`/work?category=${key}`}
              key={key}
            >
              {label}
            </Link>
          ))}
        </nav>

        {visible.length ? (
          <div className="work-list">
            {visible.map((publication) => (
              <Link href={`/work/${publication.slug}`} key={publication.pageId}>
                <span>
                  {labels[publication.document.listing.category]}
                </span>
                <h2>{publication.document.title}</h2>
                <p>{publication.document.summary}</p>
                <strong>Read page →</strong>
              </Link>
            ))}
          </div>
        ) : (
          <div className="work-list" aria-label="Foundational ZEN public record">
            {foundationalVisible.map((record) => (
              <Link href={record.href} key={`${record.category}-${record.title}`}>
                <span>{labels[record.category]}</span>
                <h2>{record.title}</h2>
                <p>{record.summary}</p>
                <strong>Open record →</strong>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
