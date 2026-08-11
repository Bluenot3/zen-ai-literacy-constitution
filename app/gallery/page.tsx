import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Field Archive",
  description:
    "A visual record of ZEN AI Co. programs, community events, live demonstrations, and hands-on technology learning.",
};

const MOMENTS = [
  {
    src: "/gallery/archive-01.jpg",
    width: 540,
    height: 960,
    code: "FIELD / 01",
    title: "Learning in public",
    caption: "Live mentoring and product exploration at the ZEN AI exhibition table.",
    alt: "A ZEN AI team member and young participant looking at a laptop during a community event",
    shape: "portrait",
  },
  {
    src: "/gallery/archive-02.jpg",
    width: 834,
    height: 960,
    code: "FIELD / 02",
    title: "The ZEN table",
    caption: "Systems, prototypes, and demonstrations staged for Steam the Block 2024.",
    alt: "ZEN AI exhibition table set up inside the Steam the Block event venue",
    shape: "portrait",
  },
  {
    src: "/gallery/archive-03.jpg",
    width: 309,
    height: 308,
    code: "BUILD / 03",
    title: "Private AI infrastructure",
    caption: "A self-hosted language-model demonstration built to make the technology tangible.",
    alt: "Screen showing a ZEN AI private self-hosted language model demonstration",
    shape: "square",
  },
  {
    src: "/gallery/archive-04.jpg",
    width: 960,
    height: 611,
    code: "FIELD / 04",
    title: "Builders behind the work",
    caption: "The ZEN AI team presenting live systems at a community technology event.",
    alt: "Two ZEN AI team members standing behind laptops and a demonstration monitor",
    shape: "wide",
  },
  {
    src: "/gallery/archive-05.jpg",
    width: 960,
    height: 640,
    code: "LEARN / 05",
    title: "Hands on means hands on",
    caption: "A young participant pilots a drone through a challenge course.",
    alt: "Young participant using a controller to fly a small drone through an orange hoop",
    shape: "wide",
  },
  {
    src: "/gallery/archive-06.jpg",
    width: 960,
    height: 720,
    code: "FIELD / 06",
    title: "A table becomes a lab",
    caption: "Families and young builders gather around live computers, devices, and demonstrations.",
    alt: "Families and young builders gathering around laptops and devices at a community event",
    shape: "wide",
  },
  {
    src: "/gallery/archive-07.jpg",
    width: 540,
    height: 960,
    code: "BUILD / 07",
    title: "Make the system visible",
    caption: "A guided, hands-on technology demonstration in the middle of the event floor.",
    alt: "ZEN AI team member demonstrating software on a laptop to event participants",
    shape: "portrait",
  },
  {
    src: "/gallery/archive-08.jpg",
    width: 960,
    height: 640,
    code: "COMMUNITY / 08",
    title: "STEAM X Fest",
    caption: "Question, create, and innovate at the Boys & Girls Club of Greater Washington.",
    alt: "STEAM X Fest sign inside the Boys and Girls Club of Greater Washington",
    shape: "wide",
  },
] as const;

export default function GalleryPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="archive" />
      <TreasuryPageFrame chapter="FIELD ARCHIVE / 02" serial="ZEN-MEMORY-MMXXVI" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Field archive</small>
          </span>
        </Link>
        <nav aria-label="Gallery navigation">
          <Link href="/">Gateway</Link>
          <Link href="/legacy-dossier">Legacy dossier</Link>
          <Link href="/start">Start with ZEN</Link>
        </nav>
      </header>

      <article className={styles.page}>
        <header className={styles.hero}>
          <div>
            <span>Programs / People / Proof in motion</span>
            <h1>
              The ZEN field
              <strong>archive.</strong>
            </h1>
          </div>
          <div className={styles.heroNote}>
            <span>Archive statement</span>
            <p>
              Technology matters when people can touch it, question it, build
              with it, and see themselves in what comes next.
            </p>
            <small>Eight original images · Preserved from the public ZEN record</small>
          </div>
        </header>

        <section className={styles.gallery} aria-label="ZEN programs and events">
          {MOMENTS.map((moment, index) => (
            <figure
              className={`${styles.moment} ${styles[moment.shape]} ${index === 0 ? styles.lead : ""}`}
              key={moment.src}
            >
              <div className={styles.imageFrame}>
                <Image
                  src={moment.src}
                  alt={moment.alt}
                  width={moment.width}
                  height={moment.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 42vw"
                  priority={index < 2}
                  unoptimized
                />
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <figcaption>
                <span>{moment.code}</span>
                <h2>{moment.title}</h2>
                <p>{moment.caption}</p>
              </figcaption>
            </figure>
          ))}
        </section>

        <section className={styles.recordNote}>
          <div>
            <span>Public memory</span>
            <h2>More than a highlight reel.</h2>
          </div>
          <div>
            <p>
              This gallery begins with the visual archive recovered from the
              original Why ZEN page. It is designed to grow into a durable record
              of programs, partners, communities, builders, and milestones.
            </p>
            <Link href="/legacy-dossier">
              View the recovered record <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className={styles.close}>
          <div>
            <span>The evidence archive</span>
            <h2>Images show the moment. The dossier preserves the record.</h2>
          </div>
          <div>
            <Link href="/legacy-dossier">Enter the Legacy Dossier →</Link>
            <Link href="/start">Build with ZEN →</Link>
          </div>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Field archive · Programs in motion</span>
        <Link href="/accessibility-statement">Accessibility</Link>
      </footer>
    </main>
  );
}
