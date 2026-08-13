import type { ManagedZenPublicMedia } from "./managed-component-renderer";
import styles from "./arsenal-product-stage.module.css";

const CAPABILITIES = [
  "Agent",
  "Knowledge",
  "Skills",
  "Tools",
  "Automations",
  "Channels",
  "Business Space",
  "Output",
  "Monetization",
] as const;

export default function ArsenalProductStage({
  media,
  buildHref,
  campaign,
}: {
  media?: ManagedZenPublicMedia;
  buildHref: string;
  campaign?: string | null;
}) {
  return (
    <section className={styles.stage} aria-labelledby="arsenal-product-title">
      <div className={styles.instrumentFrame} aria-hidden="true" />
      <header className={styles.heading} data-reveal>
        <span>Arsenal / Intelligent Operations Platform</span>
        <h2 id="arsenal-product-title">
          One intelligent environment.
          <strong>From agent to economic output.</strong>
        </h2>
        <p>
          Arsenal connects the context, tools, people, workflows, and protected
          operating spaces required to turn intelligence into useful work.
        </p>
      </header>

      <div className={styles.system} data-reveal>
        <div className={styles.capabilityRail} aria-label="Arsenal capability path">
          {CAPABILITIES.map((capability, index) => (
            <span key={capability}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              {capability}
            </span>
          ))}
        </div>

        <div className={styles.evidenceShell}>
          <div className={styles.evidenceRegister}>
            <span>Real interface evidence</span>
            <span>{media ? "Approved public media" : "Controlled system map"}</span>
          </div>
          {media ? (
            <figure className={styles.screenshot}>
              {/* The server supplies this object only through the approved public-media reader. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.publicUrl} alt={media.altText} loading="lazy" />
              <figcaption>
                <span>{media.title || "Arsenal product view"}</span>
                <small>Actual Arsenal interface · no simulated telemetry</small>
              </figcaption>
            </figure>
          ) : (
            <div className={styles.systemMap} aria-label="Arsenal operating system map">
              <div className={styles.orbit} aria-hidden="true" />
              <div className={styles.core}>
                <small>ZEN AI CO.</small>
                <strong>ARSENAL</strong>
                <span>OPERATING SYSTEM</span>
              </div>
              <p>
                An approved Arsenal screenshot can be selected from the ZEN
                Command Center without a code release.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.actions} data-reveal>
        <a
          className={styles.primary}
          href={buildHref}
          data-zen-destination-key="ARSENAL_BUILD"
          data-zen-cta="arsenal-product-stage-primary"
          data-zen-campaign={campaign ?? undefined}
        >
          Build with Arsenal <span aria-hidden="true">→</span>
        </a>
        <a className={styles.secondary} href="#solutions">
          See the operating model <span aria-hidden="true">↓</span>
        </a>
        <p>Real interface only · no simulated telemetry</p>
      </footer>
    </section>
  );
}
