import Link from "next/link";
import { gateZenPublicDestination } from "../lib/program-access-links";
import type { ManagedZenComponentKey, ManagedZenComponentProps } from "./managed-components";
import styles from "./managed-component.module.css";

export type ManagedZenPublicMedia = {
  id: string;
  publicUrl: string;
  altText: string;
  title: string;
};

export type ManagedZenPublicClaim = {
  claimKey: string;
  wording: string;
  status: string;
  source: string;
  validUntil: string;
};

export type ManagedZenComponentResources = {
  mediaById: Record<string, ManagedZenPublicMedia>;
  claimsByKey: Record<string, ManagedZenPublicClaim>;
};

export const EMPTY_MANAGED_ZEN_RESOURCES: ManagedZenComponentResources = {
  mediaById: {},
  claimsByKey: {},
};

export function ManagedZenComponent({
  componentKey,
  props,
  resources,
}: {
  componentKey: ManagedZenComponentKey;
  props: ManagedZenComponentProps;
  resources: ManagedZenComponentResources;
}) {
  if (componentKey === "arsenal_screenshot_stage") {
    const media = props.mediaId ? resources.mediaById[props.mediaId] : undefined;
    if (!media) return <Unavailable message="This product stage is waiting for an approved public Arsenal screenshot." />;
    return (
      <Shell tone="dark" eyebrow={props.eyebrow} title={props.title} body={props.body} dataKey={componentKey}>
        <figure className={styles.screenshotStage}>
          {/* Public media is returned only by the approved-media reader. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.publicUrl} alt={media.altText || props.mediaAlt} loading="lazy" />
          <figcaption>{media.altText || props.mediaAlt}</figcaption>
        </figure>
        <Cta props={props} dark />
      </Shell>
    );
  }

  if (componentKey === "verified_workflow_demonstrator") {
    return (
      <Shell eyebrow={props.eyebrow} title={props.title} body={props.body} dataKey={componentKey}>
        <ol className={styles.workflow}>
          {props.items.map((item, index) => <li key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><small>Verified sequence · no live telemetry implied</small></li>)}
        </ol>
      </Shell>
    );
  }

  if (componentKey === "before_connected_automated") {
    return (
      <Shell tone="paper" eyebrow={props.eyebrow} title={props.title} body={props.body} dataKey={componentKey}>
        <div className={styles.comparison}>
          {props.items.map((item, index) => {
            const [title, body] = item.split("|");
            return <article className={index === 1 ? styles.connected : ""} key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>;
          })}
        </div>
        <Cta props={props} />
      </Shell>
    );
  }

  if (componentKey === "arsenal_capability_exploder") {
    return (
      <Shell tone="dark" eyebrow={props.eyebrow} title={props.title} body={props.body} dataKey={componentKey} centered>
        <div className={styles.arsenalCore} aria-label="Arsenal operating system">ARSENAL</div>
        <div className={styles.capabilities}>{props.items.map((item) => <span key={item}>{item}</span>)}</div>
        <Cta props={props} dark />
      </Shell>
    );
  }

  if (componentKey === "public_program_discovery") {
    return (
      <Shell eyebrow={props.eyebrow} title={props.title} body={props.body} dataKey={componentKey}>
        <div className={styles.programs}>{props.items.map((item) => <article key={item}><span aria-hidden="true">◇</span><h3>{item}</h3><p>Public discovery here. Enrollment, lessons and progress remain protected in Arsenal.</p></article>)}</div>
        <Cta props={props} />
      </Shell>
    );
  }

  if (componentKey === "institutional_proof_record") {
    const claim = props.claimKey ? resources.claimsByKey[props.claimKey] : undefined;
    if (!claim) return <Unavailable message="This proof block is waiting for a currently valid, approved evidence record." />;
    return (
      <Shell tone="certificate" eyebrow="Approved institutional record" title={claim.wording} body={props.body} dataKey={componentKey}>
        <footer className={styles.proofFooter}><span>{claim.status}</span><span>{claim.source}</span>{claim.validUntil ? <span>Valid through {claim.validUntil}</span> : null}</footer>
      </Shell>
    );
  }

  return (
    <Shell tone="dark" eyebrow="Experimental · Hardware-dependent" title="Power Cell" body={hardwareDependentBody(props.body)} dataKey={componentKey}>
      <div className={styles.experimental}>Experimental · Hardware-dependent</div>
    </Shell>
  );
}

function Shell({ children, eyebrow, title, body, tone = "light", centered = false, dataKey }: React.PropsWithChildren<{ eyebrow: string; title: string; body: string; tone?: "light" | "dark" | "paper" | "certificate"; centered?: boolean; dataKey: string }>) {
  return <section className={`${styles.shell} ${styles[tone]} ${centered ? styles.centered : ""}`} data-zen-component={dataKey}><div><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2><p className={styles.body}>{body}</p>{children}</div></section>;
}

function Cta({ props, dark = false }: { props: ManagedZenComponentProps; dark?: boolean }) {
  const href = gateZenPublicDestination(props.ctaHref);
  if (!props.ctaLabel || !href) return null;
  const className = `${styles.cta} ${dark ? styles.ctaDark : ""}`;
  return href.startsWith("/") ? <Link className={className} href={href}>{props.ctaLabel}<span aria-hidden="true">↗</span></Link> : <a className={className} href={href}>{props.ctaLabel}<span aria-hidden="true">↗</span></a>;
}

function Unavailable({ message }: { message: string }) {
  return <section className={styles.unavailable} data-zen-component-unavailable="true"><div><strong>Controlled surface unavailable</strong><p>{message}</p></div></section>;
}

function hardwareDependentBody(value: string) {
  const normalized = value.toLowerCase();
  return normalized.includes("experimental") && normalized.includes("hardware-dependent")
    ? value
    : "Experimental and hardware-dependent. Only demonstrated prototype behavior may be described; this system is not presented as generally available.";
}
