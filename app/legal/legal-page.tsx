import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./legal.module.css";

const policyLinks = [
  ["Privacy", "/privacy-policy"],
  ["Terms", "/terms-and-conditions"],
  ["Refunds", "/refund-policy"],
  ["Accessibility", "/accessibility-statement"],
] as const;

export function LegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <TreasuryBackdrop variant="legal" />
      <TreasuryPageFrame chapter="PUBLIC POLICY" serial="ZEN-LEGAL-MMXXVI" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <Image src="/zen-mark.png" alt="" width={34} height={34} unoptimized />
          ZEN AI CO.
        </Link>
        <Link className={styles.back} href="/">← Back to ZEN</Link>
      </header>
      <main className={styles.layout}>
        <nav className={styles.nav} aria-label="Legal documents">
          <span className={styles.navLabel}>Legal &amp; support</span>
          {policyLinks.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <article className={styles.article}>
          <span className={styles.eyebrow}>ZEN AI Co. · Public policy</span>
          <h1>{title}</h1>
          <p className={styles.summary}>{summary}</p>
          {children}
          <div className={styles.contact}>
            Questions or requests:{" "}
            <a href="mailto:HUXLEY@ZENAI.BIZ">HUXLEY@ZENAI.BIZ</a>
          </div>
        </article>
      </main>
    </div>
  );
}

export function PolicySection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <span className={styles.number}>{String(number).padStart(2, "0")}</span>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
