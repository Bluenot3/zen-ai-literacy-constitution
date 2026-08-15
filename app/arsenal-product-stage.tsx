import Image from "next/image";
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
  "Proof",
  "Monetization",
] as const;

const SYSTEM_BANDS = [
  ["01", "Intelligence", "Agent", "Knowledge"],
  ["02", "Capability", "Skills", "Tools"],
  ["03", "Orchestration", "Automations", "Channels"],
  ["04", "Operations", "Business Space", "Output"],
  ["05", "Economics", "Proof", "Monetization"],
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

        <div className={styles.operatingFlow} aria-label="Arsenal operating flow">
          {SYSTEM_BANDS.map(([code, label, left, right]) => (
            <div className={styles.flowStage} key={code}>
              <span>{code}</span>
              <div>
                <small>{label}</small>
                <strong>{left}</strong>
                <i aria-hidden="true" />
                <strong>{right}</strong>
              </div>
            </div>
          ))}
          <div className={styles.flowSignal} aria-hidden="true">
            <span />
          </div>
        </div>
        <div className={styles.evidenceShell}>
          <div className={styles.evidenceRegister}>
            <span>{media ? "Real interface evidence" : "Founding evidence"}</span>
            <span>{media ? "Approved public media" : "Founding credential + operating cutaway"}</span>
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
            <div
              className={styles.heritageSystem}
              aria-label="ZEN founding credential connected to the Arsenal operating system"
            >
              <figure className={styles.credentialArtifact}>
                <div className={styles.credentialRegister}>
                  <span>Founding credential</span>
                  <span>United States · MMXXIII</span>
                </div>
                <div className={styles.credentialImage}>
                  <Image
                    src="/national-first.png"
                    alt="ZEN AI Co. — The first youth AI literacy program in United States history"
                    width={1672}
                    height={941}
                    sizes="(max-width: 980px) 92vw, 52vw"
                    unoptimized
                  />
                  <div className={styles.credentialSheen} aria-hidden="true" />
                  <div className={styles.credentialCorners} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <figcaption>
                  <span>AI Pioneer · national capability record</span>
                  <strong>Proof before platform.</strong>
                </figcaption>
              </figure>

              <div className={styles.cutaway}>
                <header className={styles.cutawayHead}>
                  <span>Arsenal / operating system cutaway</span>
                  <strong>Capability, assembled.</strong>
                  <p>
                    The founding literacy mission continues as an operating
                    system for real agents, business work, proof, and economic
                    output.
                  </p>
                </header>

                <figure className={styles.engineVisual}>
                  <div className={styles.engineMachine}>
                    <Image
                      src="/arsenal-capability-engine.jpg"
                      alt="Conceptual architectural visualization of the Arsenal capability engine"
                      width={1086}
                      height={1448}
                      sizes="(max-width: 980px) 92vw, 38vw"
                      unoptimized
                    />
                    <span className={styles.engineMark} aria-hidden="true">
                      <Image
                        src="/zen-mark.png"
                        alt=""
                        width={1254}
                        height={1254}
                        sizes="5rem"
                        unoptimized
                      />
                    </span>
                  </div>
                  <figcaption>
                    <span>Conceptual architecture · no simulated interface</span>
                    <strong>Arsenal capability engine</strong>
                  </figcaption>
                </figure>


                <div className={styles.systemNameplate}>
                  <span>ZEN AI CO. / BUSINESS EXECUTION SYSTEM</span>
                  <strong>ARSENAL</strong>
                  <small>Intelligence → capability → verified value</small>
                </div>
              </div>

              <div className={styles.transferLine} aria-hidden="true">
                <span>01</span>
                <i />
                <strong>LEARN → BUILD → OPERATE → PROVE</strong>
                <i />
                <span>05</span>
              </div>
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
        <p>
          {media
            ? "Real interface only · no simulated telemetry"
            : "Founding evidence · conceptual architecture clearly labeled"}
        </p>
      </footer>
    </section>
  );
}
