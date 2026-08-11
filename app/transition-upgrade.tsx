import Image from "next/image";
import Link from "next/link";
import styles from "./transition-upgrade.module.css";

const ARSENAL_GOOGLE_ACTIVATION =
  "https://kcyklettzoyexxynqfer.supabase.co/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Farsenal.world%2Fdashboard";

const CONTINUITY_SIGNALS = [
  {
    code: "01",
    title: "Same domain",
    copy: "ZENAI.WORLD remains the official public home of ZEN AI Co.",
  },
  {
    code: "02",
    title: "Same mission",
    copy: "AI literacy, human agency, public proof, and practical capability continue here.",
  },
  {
    code: "03",
    title: "Expanded platform",
    copy: "Arsenal now carries the signed-in experience: agents, programs, files, community, and more.",
  },
] as const;

const ACCESS_STEPS = [
  ["1", "Activate with Google", "Start the same secure Google flow used inside Arsenal."],
  ["2", "Confirm your identity", "Use the Google account connected to your ZEN activity whenever possible."],
  ["3", "Enter Arsenal", "Arsenal signs you in or creates your verified identity, then opens your dashboard."],
] as const;

export default function TransitionUpgrade() {
  return (
    <section id="transition" className={styles.section} aria-labelledby="transition-title">
      <div className={styles.securityThread} aria-hidden="true">
        <span>ZENAI.WORLD</span>
        <span>CONTINUITY RECORD</span>
        <span>SERIES 2026</span>
      </div>

      <div className={styles.shell}>
        <div className={styles.intro} data-reveal>
          <div className={styles.mark} aria-hidden="true">
            <Image src="/zen-mark.png" alt="" width={96} height={96} unoptimized />
          </div>
          <span className={styles.eyebrow}>The ZENAI.WORLD upgrade</span>
          <h2 id="transition-title">
            Same ZEN.
            <span>Vastly more capability.</span>
          </h2>
          <p>
            This is not a different company or a disconnected replacement.
            ZENAI.WORLD has become the public gateway to the larger ZEN
            ecosystem, with Arsenal powering the signed-in operating
            experience.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href={ARSENAL_GOOGLE_ACTIVATION}>
              Activate with Google <span aria-hidden="true">→</span>
            </a>
            <Link className={styles.secondary} href="/access">
              View access options
            </Link>
          </div>
        </div>

        <div className={styles.continuity} data-reveal aria-label="ZEN continuity status">
          <header>
            <span>Continuity status</span>
            <strong><i aria-hidden="true" /> Upgrade active</strong>
          </header>
          {CONTINUITY_SIGNALS.map((signal) => (
            <article key={signal.code}>
              <span>{signal.code}</span>
              <div>
                <h3>{signal.title}</h3>
                <p>{signal.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.accessRail} data-reveal>
        <header>
          <span>Existing member access</span>
          <strong>One secure click opens the expanded ZEN platform.</strong>
        </header>
        <div className={styles.steps}>
          {ACCESS_STEPS.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p className={styles.safety}>
          ZEN will never ask for your password, API key, or private records in
          an account-support form.
        </p>
      </div>
    </section>
  );
}
