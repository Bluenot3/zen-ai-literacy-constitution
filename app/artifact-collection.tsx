import Image from "next/image";
import styles from "./artifact-collection.module.css";

// Add future public artifacts here. Only officially issued Claude embed URLs
// should be supplied as embedUrl; ordinary share URLs cannot be framed reliably.
const publishedArtifacts: Array<{
  id: string;
  edition: string;
  title: string;
  description: string;
  url: string;
  embedUrl?: string;
}> = [
  {
    id: "E9FCpGG7CewWuEVyyHzUUo",
    edition: "001",
    title: "ZEN published artifact",
    description:
      "Explore an original creation from ZEN AI Co.'s published artifact collection.",
    url: "https://claude.ai/artifact/E9FCpGG7CewWuEVyyHzUUo",
  },
];

export default function ArtifactCollection() {
  return (
    <section id="artifacts" className={styles.section} aria-labelledby="zen-artifacts-heading">
      <div className={styles.inner}>
        <div className={styles.overline}>
          <span>ZEN AI CO. / THE LIVING COLLECTION</span>
          <span>PUBLIC EXHIBITS · MMXXVI</span>
        </div>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Selected creations</p>
          <h2 id="zen-artifacts-heading">Open the work.</h2>
          <p>
            Explore published creations from the ZEN ecosystem. Each exhibit
            connects to its original interactive or viewable experience.
          </p>
        </div>
        <div className={styles.gallery}>
          {publishedArtifacts.map((artifact) => (
            <article className={styles.card} key={artifact.id}>
              {artifact.embedUrl ? (
                <div className={styles.embedded}>
                  <iframe
                    src={artifact.embedUrl}
                    title={artifact.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="clipboard-write"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className={styles.artwork} aria-hidden="true">
                  <div className={styles.rings} />
                  <div className={styles.mark}>
                    <Image src="/zen-mark.png" width={116} height={116} alt="" unoptimized />
                  </div>
                  <span className={styles.artworkSerial}>ZEN / ARTIFACT {artifact.edition}</span>
                </div>
              )}
              <div className={styles.content}>
                <div className={styles.cardMeta}>
                  <span>EXHIBIT {artifact.edition}</span>
                  <span>PUBLISHED ON CLAUDE</span>
                </div>
                <h3>{artifact.title}</h3>
                <p>{artifact.description}</p>
                <a
                  className={styles.cta}
                  href={artifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${artifact.title} on Claude in a new tab`}
                  data-zen-cta="artifact-collection-open"
                >
                  Open original artifact <span aria-hidden="true">↗</span>
                </a>
                <small>Hosted by Claude. A Claude sign-in may be required.</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
