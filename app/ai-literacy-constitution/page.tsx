import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./constitution.module.css";

export const metadata: Metadata = {
  title: "AI Literacy Constitution",
  description:
    "ZEN AI Co.'s living public principles for practical AI literacy, human agency, evidence, safety, and access.",
};

const ARTICLES = [
  {
    number: "I",
    title: "Human agency is the first capability.",
    text: "AI literacy begins with the ability to choose, question, direct, pause, and refuse. People should understand when AI is involved, what it can influence, and where accountable human judgment remains required.",
    standard: "Make control, approval, and accountability visible.",
  },
  {
    number: "II",
    title: "Understanding comes before automation.",
    text: "A useful system should not depend on mystery. Learners and operators deserve a clear mental model of inputs, outputs, limitations, uncertainty, data use, and the practical consequences of a result.",
    standard: "Explain the system well enough to use it deliberately.",
  },
  {
    number: "III",
    title: "Build to learn. Verify to advance.",
    text: "Literacy becomes capability through practice. Prompts, agents, apps, workflows, research, and media should produce inspectable work—not just passive familiarity or impressive demonstrations.",
    standard: "Pair every important concept with a task, artifact, or test.",
  },
  {
    number: "IV",
    title: "Evidence should travel with the claim.",
    text: "Sources, assumptions, dates, decisions, and outputs should remain traceable. Confidence is not proof, and fluency is not accuracy. Public impact claims deserve the same discipline as technical work.",
    standard: "Show what supports the result and what remains uncertain.",
  },
  {
    number: "V",
    title: "Safety, privacy, and boundaries are part of literacy.",
    text: "People should know what must not be shared, which actions need permission, and where AI must not make a high-impact decision alone. Capability includes the discipline to protect data and fail safely.",
    standard: "Minimize sensitive data and keep consequential approval human.",
  },
  {
    number: "VI",
    title: "Access must lead to meaningful participation.",
    text: "AI literacy should expand who can create, contribute, earn, and shape the systems around them. Access without understandable tools, practical support, and a path to real work is incomplete.",
    standard: "Design for comprehension, accessibility, and durable opportunity.",
  },
] as const;

export default function ConstitutionPage() {
  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="charter" />
      <TreasuryPageFrame chapter="CIVIC CHARTER / 01" serial="ZEN-AILC-MMXXVI" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Public standard</small>
          </span>
        </Link>
        <nav aria-label="Constitution navigation">
          <Link href="/">Gateway</Link>
          <Link href="/work?category=knowledge">Knowledge</Link>
          <Link href="/start">Start with ZEN</Link>
        </nav>
      </header>

      <article className={styles.charter}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span>Living public draft · Series MMXXVI</span>
            <h1>
              The AI Literacy
              <strong>Constitution.</strong>
            </h1>
            <p>
              A practical charter for building AI capability without surrendering
              human agency, evidence, safety, or access.
            </p>
          </div>
          <div className={styles.charterSeal} aria-hidden="true">
            <div />
            <div />
            <Image
              src="/zen-mark.png"
              alt=""
              width={180}
              height={180}
              unoptimized
            />
            <span>Literacy / Agency / Proof</span>
          </div>
          <div className={styles.heroSerial} aria-hidden="true">
            <span>ZEN AILC 000001</span>
            <span>Human agency remains the authority</span>
          </div>
        </header>

        <section className={styles.preamble}>
          <span>Preamble</span>
          <div>
            <h2>Intelligence is powerful. Capability must remain human.</h2>
            <p>
              ZEN AI Co. treats AI literacy as more than tool familiarity. It is
              the ability to understand a system well enough to direct it,
              evaluate it, build with it, protect people around it, and prove
              what the work actually accomplished.
            </p>
            <p>
              This charter is a living public standard for ZEN programs,
              products, partnerships, and learning material. It is not a law,
              certification, or substitute for professional guidance. It is a
              visible commitment against which our work can be questioned and
              improved.
            </p>
          </div>
        </section>

        <section className={styles.articles} aria-label="Constitution articles">
          {ARTICLES.map((article, index) => (
            <article key={article.number}>
              <div className={styles.articleNumber} aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{article.number}</strong>
              </div>
              <div className={styles.articleCopy}>
                <span>Article {article.number}</span>
                <h2>{article.title}</h2>
                <p>{article.text}</p>
                <div>
                  <small>ZEN operating standard</small>
                  <strong>{article.standard}</strong>
                </div>
              </div>
              <div className={styles.articleRosette} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </article>
          ))}
        </section>

        <section className={styles.revision}>
          <div>
            <span>Revision protocol</span>
            <h2>A constitution should be inspectable—and capable of learning.</h2>
            <p>
              Future versions should preserve a visible revision record,
              explain material changes, and incorporate evidence from learners,
              educators, builders, institutions, and affected communities.
            </p>
          </div>
          <div className={styles.revisionLedger}>
            <div><span>Version</span><strong>Public draft 1.0</strong></div>
            <div><span>Status</span><strong>Open for informed feedback</strong></div>
            <div><span>Issued</span><strong>Series MMXXVI</strong></div>
            <a href="mailto:huxley@zenai.biz?subject=AI%20Literacy%20Constitution%20feedback">
              Submit thoughtful feedback →
            </a>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <span>Put the charter into practice</span>
            <h2>Learn it. Build it. Prove it.</h2>
          </div>
          <div>
            <Link href="/start">Start with ZEN →</Link>
            <a
              href="https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/preview?source=zenai.world&utm_source=zenai.world&utm_medium=owned&utm_campaign=pioneer_launch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore AI Pioneer ↗
            </a>
          </div>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · AI Literacy Constitution · Public draft</span>
        <Link href="/accessibility-statement">Accessibility</Link>
      </footer>
    </main>
  );
}
