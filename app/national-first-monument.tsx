import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./national-first-monument.module.css";

const ADVANCEMENT_PATH = [
  ["01", "Literacy", "Understand intelligence"],
  ["02", "Agency", "Direct it with judgment"],
  ["03", "Invention", "Build what did not exist"],
  ["04", "Proof", "Make capability visible"],
  ["05", "Progress", "Advance human possibility"],
] as const;

export default function NationalFirstMonument() {
  return (
    <section id="national-first" className={styles.monument}>
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.microprint} aria-hidden="true">
        ZEN AI CO. · YOUTH INTELLIGENCE LITERACY · UNITED STATES · HUMAN
        CAPABILITY · BUILD · VERIFY · ADVANCE ·
      </div>
      <div className={styles.frame} aria-hidden="true">
        <span>01</span>
        <span>US</span>
        <span>Z</span>
        <span>MMXXIII</span>
      </div>

      <header className={styles.register} data-reveal>
        <span>National capability record · first edition</span>
        <strong>ZEN AI Co. / AI Pioneer</strong>
        <span>No. US–YL–0001</span>
      </header>

      <figure className={styles.proclamation} data-reveal>
        <div className={styles.proclamationLines} aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
        </div>
        <div className={styles.proclamationImage}>
          <Image
            src="/national-first.png"
            alt="ZEN AI Co. — The first youth AI literacy program in United States history. Intelligence into capability."
            width={1672}
            height={941}
            sizes="(max-width: 780px) 94vw, 90vw"
            unoptimized
          />
        </div>
        <figcaption>
          <div>
            <span>Historic proclamation · original ZEN artwork</span>
            <strong>A national first marking a new era of human capability.</strong>
          </div>
          <a
            href="https://arsenal.world/programs/pioneer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter AI Pioneer <i aria-hidden="true">↗</i>
          </a>
        </figcaption>
      </figure>

      <div className={styles.grid}>
        <div className={styles.claim} data-reveal>
          <span className={styles.kicker}>A United States First</span>
          <p className={styles.firstLine}>The first</p>
          <h2>
            Youth AI Literacy
            <span>Program</span>
          </h2>
          <p className={styles.historyLine}>in United States history.</p>
          <p className={styles.statement}>
            ZEN AI Co. created the nation&apos;s first youth AI literacy
            program to place human agency at the center of a new era of
            intelligence. AI Pioneer is the founding program behind that
            historic distinction and the beginning of ZEN&apos;s broader mission
            to advance human capability.
          </p>
          <div className={styles.actions}>
            <a
              href="https://arsenal.world/programs/pioneer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enter the historic program <span aria-hidden="true">↗</span>
            </a>
            <Link href="/work?category=accomplishments">
              Open the public record <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.instrument} data-reveal>
          <div className={styles.lathe} aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => (
              <span key={index} style={{ "--ring": index } as CSSProperties} />
            ))}
          </div>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.energyWaves} aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => <span key={index} />)}
          </div>
          <div className={styles.energyField} aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i
                key={index}
                style={{ "--energy-index": index } as CSSProperties}
              />
            ))}
          </div>
          <div className={styles.symbolOrbit} aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <span
                key={index}
                style={{ "--symbol-index": index } as CSSProperties}
              />
            ))}
          </div>
          <div className={styles.insigniaCore}>
            <Image
              src="/zen-mark.png"
              alt="ZEN AI Co."
              width={176}
              height={176}
              unoptimized
            />
            <span>National First</span>
          </div>
          <div className={styles.fiftyPoints} aria-hidden="true">
            {Array.from({ length: 50 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
          <p className={styles.instrumentTop}>Youth capability · national first</p>
          <p className={styles.instrumentBottom}>Fifty states · one human future</p>
          <span className={styles.starLeft} aria-hidden="true">✦</span>
          <span className={styles.starRight} aria-hidden="true">✦</span>
        </div>
      </div>

      <div className={styles.horizon} data-reveal>
        <div className={styles.horizonIntro}>
          <span>The human horizon</span>
          <h3>Intelligence should enlarge human possibility.</h3>
          <p>
            Humanity advances when the next generation can understand powerful
            systems, exercise judgment, make useful things, and extend that
            capability toward shared progress.
          </p>
        </div>
        <div className={styles.path}>
          {ADVANCEMENT_PATH.map(([number, title, detail]) => (
            <div key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Established MMXXIII · Washington, D.C.</span>
        <span>Learn · Build · Deploy · Prove</span>
        <span>ZEN AI Co. initiative · Human-led by design</span>
      </footer>
    </section>
  );
}
