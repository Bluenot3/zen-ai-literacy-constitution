import Image from "next/image";
import Link from "next/link";
import styles from "./heritage-archive.module.css";

const DOSSIER_PDF =
  "/legacy-dossier/record-case/2023-2025/ZEN_AI_Pioneer_Proof_Dossier_2023-2025%20(2).pdf";

export default function HeritageArchive() {
  return (
    <section id="archive" className={styles.section} aria-labelledby="archive-title">
      <div className={styles.register} aria-hidden="true">
        <span>ZEN / PUBLIC MEMORY / 2023—PRESENT</span>
        <span>RECORD NO. ZEN-PD-2023-2025-v2</span>
      </div>

      <header className={styles.header} data-reveal>
        <div>
          <span className={styles.eyebrow}>The ZEN record</span>
          <h2 id="archive-title">
            The work happened.
            <strong>The evidence remains.</strong>
          </h2>
        </div>
        <p>
          Programs, field work, deployed systems, and the people who built with
          us belong in the permanent record—not buried in a feed.
        </p>
      </header>

      <div className={styles.grid}>
        <article className={styles.dossier} data-reveal>
          <div className={styles.dossierCover}>
            <Image
              src="/legacy-dossier/record-case/2023-2025/zen_dossier_cover_v2.png"
              alt="Cover of the ZEN AI Pioneer Proof Dossier, 2023 to 2025"
              width={1600}
              height={1600}
              unoptimized
            />
            <span aria-hidden="true">01</span>
          </div>
          <div className={styles.dossierCopy}>
            <span>United States AI Record Case</span>
            <h3>ZEN Legacy Dossier</h3>
            <p>
              The complete public archival record for the AI Pioneer Program,
              including the official dossier, program statement, machine-readable
              proof, and timestamp record.
            </p>
            <dl>
              <div>
                <dt>Document</dt>
                <dd>ZEN-PD-2023-2025-v2</dd>
              </div>
              <div>
                <dt>Coverage</dt>
                <dd>2023—2025</dd>
              </div>
              <div>
                <dt>Integrity</dt>
                <dd>SHA-256 verified</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/legacy-dossier">
                Enter the dossier <span aria-hidden="true">→</span>
              </Link>
              <a href={DOSSIER_PDF} target="_blank" rel="noopener noreferrer">
                Open the record <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>

        <article className={styles.gallery} data-reveal>
          <div className={styles.galleryCopy}>
            <span>Field archive / Programs in motion</span>
            <h3>Built with people, in public.</h3>
            <p>
              A growing visual record of ZEN programs, community events,
              demonstrations, young builders, and the moments capability became
              tangible.
            </p>
            <Link href="/gallery">
              View the gallery <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.contactSheet} aria-label="Preview of the ZEN field archive">
            <figure className={styles.photoOne}>
              <Image
                src="/gallery/archive-04.jpg"
                alt="ZEN AI team members at a community technology event"
                width={960}
                height={611}
                unoptimized
              />
            </figure>
            <figure className={styles.photoTwo}>
              <Image
                src="/gallery/archive-05.jpg"
                alt="Young participant piloting a drone through a hoop"
                width={960}
                height={640}
                unoptimized
              />
            </figure>
            <figure className={styles.photoThree}>
              <Image
                src="/gallery/archive-06.jpg"
                alt="Families and young builders gathering around the ZEN technology table"
                width={960}
                height={720}
                unoptimized
              />
            </figure>
          </div>
        </article>
      </div>
    </section>
  );
}
