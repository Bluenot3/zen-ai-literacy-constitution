import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./legacy-dossier.module.css";

export const metadata: Metadata = {
  title: "ZEN Legacy Dossier",
  description:
    "The public archival record of the ZEN AI Pioneer Program, preserved with its dossier, program statement, proof metadata, and timestamp record.",
};

const ROOT = "/legacy-dossier/record-case/2023-2025";
const DOSSIER = `${ROOT}/ZEN_AI_Pioneer_Proof_Dossier_2023-2025%20(2).pdf`;

const FILES = [
  {
    code: "01",
    label: "Proof dossier",
    name: "ZEN_AI_Pioneer_Proof_Dossier_2023-2025 (2).pdf",
    detail: "Official archival record · PDF · 34 KB",
    href: DOSSIER,
  },
  {
    code: "02",
    label: "Program statement",
    name: "zen_ai_pioneer_program_statement.pdf",
    detail: "Official program statement · PDF · 8 KB",
    href: `${ROOT}/zen_ai_pioneer_program_statement.pdf`,
  },
  {
    code: "03",
    label: "Machine record",
    name: "ZEN_AI_Pioneer_Proof_Anchoring_Record.json",
    detail: "Detached proof metadata · JSON",
    href: `${ROOT}/ZEN_AI_Pioneer_Proof_Anchoring_Record.json`,
  },
  {
    code: "04",
    label: "Plaintext record",
    name: "ZEN_AI_Pioneer_Proof_Anchoring_Record.txt",
    detail: "Human-readable proof metadata · TXT",
    href: `${ROOT}/ZEN_AI_Pioneer_Proof_Anchoring_Record.txt`,
  },
  {
    code: "05",
    label: "Timestamp proof",
    name: "zen_ai_pioneer_program_statement.pdf (1).ots",
    detail: "OpenTimestamps proof file · OTS",
    href: `${ROOT}/zen_ai_pioneer_program_statement.pdf%20(1).ots`,
  },
  {
    code: "06",
    label: "Dossier cover",
    name: "zen_dossier_cover_v2.png",
    detail: "Original cover artwork · PNG",
    href: `${ROOT}/zen_dossier_cover_v2.png`,
  },
] as const;

const VERIFICATION = [
  {
    label: "Source repository",
    detail: "Browse the preserved source record on GitHub.",
    href: "https://github.com/Bluenot3/ZEN-LegacyDossier",
  },
  {
    label: "Archive.org kit",
    detail: "Open the independent public preservation copy.",
    href: "https://archive.org/details/zen-us-ai-record-case-2023-2025-verification-kit",
  },
  {
    label: "IPFS record",
    detail: "Resolve the content-addressed archive bundle.",
    href: "https://bafybeieaclbghldgdyfgk475kldwl4xvwlkeeqowatzokwk36m3lrplu6a.ipfs.w3s.link/",
  },
  {
    label: "Base record",
    detail: "Inspect the public contract record on Basescan.",
    href: "https://basescan.org/token/0xb59d6dd5197df2c337aeb61dc03a0350cd76fd33#code",
  },
] as const;

export default function LegacyDossierPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="archive" />
      <TreasuryPageFrame chapter="PUBLIC MEMORY / 01" serial="ZEN-PD-2023-2025-v2" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Legacy dossier</small>
          </span>
        </Link>
        <nav aria-label="Archive navigation">
          <Link href="/">Gateway</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/work">Public work</Link>
        </nav>
      </header>

      <article className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span>United States AI Record Case · Established 2023</span>
            <h1>
              ZEN Legacy
              <strong>Dossier.</strong>
            </h1>
            <p>
              The public archival record of the AI Pioneer Program—preserved for
              historical permanence, transparency, and independent verification.
            </p>
            <div className={styles.heroActions}>
              <a href={DOSSIER} target="_blank" rel="noopener noreferrer">
                Open the complete dossier <span aria-hidden="true">↗</span>
              </a>
              <a href={DOSSIER} download>
                Download PDF <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <figure className={styles.cover}>
            <Image
              src={`${ROOT}/zen_dossier_cover_v2.png`}
              alt="Cover of the ZEN AI Pioneer Proof Dossier, 2023 to 2025"
              width={1600}
              height={1600}
              priority
              unoptimized
            />
            <figcaption>
              <span>Official record cover</span>
              <strong>ZEN-PD-2023-2025-v2</strong>
            </figcaption>
          </figure>
        </header>

        <section className={styles.identity} aria-label="Dossier identity">
          <div>
            <span>Document ID</span>
            <strong>ZEN-PD-2023-2025-v2</strong>
          </div>
          <div>
            <span>Years covered</span>
            <strong>2023—2025</strong>
          </div>
          <div>
            <span>Program</span>
            <strong>AI Pioneer · Ages 11+</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Public archival record</strong>
          </div>
        </section>

        <section className={styles.manifest} aria-labelledby="manifest-title">
          <header className={styles.sectionHeader}>
            <div>
              <span>Record contents / Original files</span>
              <h2 id="manifest-title">The complete case file.</h2>
            </div>
            <p>
              All source artifacts are served here with their original filenames
              and contents intact. Each file can be opened or downloaded directly.
            </p>
          </header>
          <div className={styles.fileGrid}>
            {FILES.map((file) => (
              <a key={file.code} href={file.href} download>
                <span>{file.code}</span>
                <div>
                  <small>{file.label}</small>
                  <h3>{file.name}</h3>
                  <p>{file.detail}</p>
                </div>
                <strong aria-hidden="true">↓</strong>
              </a>
            ))}
          </div>
          <a className={styles.readme} href="/legacy-dossier/README.md" target="_blank" rel="noopener noreferrer">
            Read the original repository notes <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className={styles.integrity} aria-labelledby="integrity-title">
          <div className={styles.integrityCopy}>
            <span>Cryptographic integrity</span>
            <h2 id="integrity-title">Proof that travels with the record.</h2>
            <p>
              The dossier distributed on this site resolves to the same SHA-256
              value recorded in its bundled JSON and plaintext proof files.
            </p>
            <div className={styles.hash}>
              <small>SHA-256 · Verified against delivered PDF</small>
              <code>ffed4cc81b735d7ddc164ca3c851f9fffb12ae04f23598d7a0b7110212c6a578</code>
            </div>
            <p className={styles.integrityNote}>
              Verification confirms file integrity; it does not require trust in
              this website or replace independent review of the record’s claims.
            </p>
          </div>
          <div className={styles.verificationGrid}>
            {VERIFICATION.map((source, index) => (
              <a href={source.href} key={source.label} target="_blank" rel="noopener noreferrer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{source.label}</strong>
                  <p>{source.detail}</p>
                </div>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.close}>
          <div>
            <span>Continue through the record</span>
            <h2>See the work in motion.</h2>
          </div>
          <div>
            <Link href="/gallery">Enter the field archive →</Link>
            <Link href="/start">Start with ZEN →</Link>
          </div>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Public memory · Record preserved as published</span>
        <Link href="/accessibility-statement">Accessibility</Link>
      </footer>
    </main>
  );
}
