"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TreasuryBackdrop, TreasuryPageFrame } from "../treasury-chrome";
import styles from "./start.module.css";

type Audience =
  | "business"
  | "educator"
  | "learner"
  | "community"
  | "partner";

type OperatingModel =
  | "solo"
  | "small_team"
  | "multi_location"
  | "enterprise_unit";

type IntakeDraft = {
  audience: Audience | "";
  contactName: string;
  email: string;
  role: string;
  organizationName: string;
  industry: string;
  website: string;
  location: string;
  purpose: "own_business" | "client_build";
  operatingModel: OperatingModel | "";
  primaryGoal: string;
  biggestFriction: string;
  desiredOutcome: string;
  systemsUsed: string[];
  preferredChannels: string[];
  timeline: string;
};

const AUDIENCES: Array<{
  value: Audience;
  title: string;
  copy: string;
  code: string;
}> = [
  {
    value: "business",
    title: "Business or organization",
    copy: "Prepare the context for a Business Space, AI workforce, workflow, or operating system.",
    code: "B-01",
  },
  {
    value: "educator",
    title: "School or educator",
    copy: "Explore AI literacy, classroom pathways, programs, or institutional collaboration.",
    code: "E-02",
  },
  {
    value: "learner",
    title: "Learner or family",
    copy: "Find the right learning path and understand what learners will build and prove.",
    code: "L-03",
  },
  {
    value: "community",
    title: "Community or nonprofit",
    copy: "Bring practical AI capability to a community, initiative, or public-interest effort.",
    code: "C-04",
  },
  {
    value: "partner",
    title: "Strategic partner",
    copy: "Begin a collaboration, sponsored program, platform, research, or distribution conversation.",
    code: "P-05",
  },
];

const SYSTEM_OPTIONS = [
  "Website or storefront",
  "Email and calendar",
  "CRM or customer records",
  "Documents and knowledge",
  "Project management",
  "Payments or commerce",
  "Support or help desk",
  "Analytics and reporting",
] as const;

const CHANNEL_OPTIONS = [
  "Web",
  "Email",
  "Slack or Teams",
  "SMS or phone",
  "Social",
  "Internal workspace",
] as const;

const INITIAL_DRAFT: IntakeDraft = {
  audience: "",
  contactName: "",
  email: "",
  role: "",
  organizationName: "",
  industry: "",
  website: "",
  location: "",
  purpose: "own_business",
  operatingModel: "",
  primaryGoal: "",
  biggestFriction: "",
  desiredOutcome: "",
  systemsUsed: [],
  preferredChannels: [],
  timeline: "",
};

const STEPS = [
  ["01", "Route", "Who is arriving"],
  ["02", "Context", "Who and where"],
  ["03", "Capability", "What needs to change"],
  ["04", "Brief", "Review and continue"],
] as const;

const BUSINESS_SPACE_URL =
  "https://arsenal.world/login?next=%2Fbusiness-spaces%2Fnew&utm_source=zenai.world&utm_medium=owned&utm_campaign=business_space_intake";
const PIONEER_URL =
  "https://ai-pioneer-courses-20260725.zenagi.chatgpt.site/programs/pioneer/preview?source=zenai.world&utm_source=zenai.world&utm_medium=owned&utm_campaign=pioneer_launch";

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function StartIntake() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<IntakeDraft>(INITIAL_DRAFT);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const requiresOrganization = draft.audience !== "learner";
  const canContinue =
    (step === 0 && Boolean(draft.audience)) ||
    (step === 1 &&
      Boolean(draft.contactName.trim()) &&
      Boolean(draft.email.trim()) &&
      (!requiresOrganization || Boolean(draft.organizationName.trim()))) ||
    (step === 2 && Boolean(draft.primaryGoal.trim())) ||
    step === 3;

  const selectedAudience = AUDIENCES.find(
    (audience) => audience.value === draft.audience,
  );

  const brief = useMemo(() => {
    const lines = [
      "ZEN ARRIVAL BRIEF · VERSION 1",
      "Source: zenai.world",
      `Gateway route: ${selectedAudience?.title ?? "Not selected"}`,
      "",
      "CONTACT",
      `Name: ${draft.contactName || "Not provided"}`,
      `Email: ${draft.email || "Not provided"}`,
      `Role: ${draft.role || "Not provided"}`,
      "",
      "ORGANIZATION",
      `Name: ${draft.organizationName || "Not applicable / not provided"}`,
      `Industry or field: ${draft.industry || "Not provided"}`,
      `Website: ${draft.website || "Not provided"}`,
      `Location: ${draft.location || "Not provided"}`,
      `Purpose: ${humanize(draft.purpose)}`,
      `Operating model: ${draft.operatingModel ? humanize(draft.operatingModel) : "Not provided"}`,
      "",
      "CAPABILITY INTENT",
      `Primary goal: ${draft.primaryGoal || "Not provided"}`,
      `Biggest friction: ${draft.biggestFriction || "Not provided"}`,
      `Desired outcome: ${draft.desiredOutcome || "Not provided"}`,
      `Current systems: ${draft.systemsUsed.join(", ") || "None selected"}`,
      `Preferred channels: ${draft.preferredChannels.join(", ") || "None selected"}`,
      `Timeline: ${draft.timeline || "Not provided"}`,
      "",
      "This brief prepares context only. It does not create a Business Space,",
      "change an Arsenal profile, authorize automation, or grant paid access.",
    ];
    return lines.join("\n");
  }, [draft, selectedAudience]);

  const emailHref = useMemo(() => {
    const subject = `ZEN arrival brief · ${draft.organizationName || draft.contactName || "new inquiry"}`;
    return `mailto:huxley@zenai.biz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
  }, [brief, draft.contactName, draft.organizationName]);

  const destination =
    draft.audience === "business"
      ? {
          href: BUSINESS_SPACE_URL,
          label: "Continue to protected Arsenal setup ↗",
          note: "Arsenal will apply its current sign-in, feature access, and plan rules before a Business Space can be created.",
        }
      : draft.audience === "learner" || draft.audience === "educator"
        ? {
            href: PIONEER_URL,
            label: "Explore AI Pioneer ↗",
            note: "The program opens separately; sending the brief is optional.",
          }
        : null;

  const update = <Key extends keyof IntakeDraft>(
    key: Key,
    value: IntakeDraft[Key],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const toggle = (
    key: "systemsUsed" | "preferredChannels",
    value: string,
  ) => {
    const values = draft[key];
    update(
      key,
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <main className={styles.shell}>
      <TreasuryBackdrop variant="issuance" />
      <TreasuryPageFrame chapter="ARRIVALS / 01" serial="ZEN-INTAKE-V1" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="ZEN AI Co. home">
          <Image src="/zen-mark.png" alt="" width={38} height={38} unoptimized />
          <span>
            <strong>ZEN AI Co.</strong>
            <small>Guided arrival</small>
          </span>
        </Link>
        <nav aria-label="Start page navigation">
          <Link href="/">Gateway</Link>
          <Link href="/ai-literacy-constitution">Constitution</Link>
          <Link href="/work">Public work</Link>
        </nav>
      </header>

      <div className={styles.intakeLayout}>
        <aside className={styles.manifest} aria-label="Intake progress">
          <span className={styles.kicker}>Arrival manifest</span>
          <h1>Start with context.</h1>
          <p>
            Answer only what helps ZEN route you. Your answers remain in this
            page until you choose to email or copy the brief.
          </p>
          <ol>
            {STEPS.map(([number, title, detail], index) => (
              <li key={number} data-active={step === index} data-complete={step > index}>
                <button
                  type="button"
                  onClick={() => index <= step && setStep(index)}
                  disabled={index > step}
                  aria-current={step === index ? "step" : undefined}
                >
                  <span>{number}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.manifestNote}>
            Never enter passwords, API keys, private customer records, health
            information, or other sensitive data.
          </div>
        </aside>

        <section className={styles.instrument} aria-labelledby="intake-step-title">
          <div className={styles.instrumentHead}>
            <div>
              <span>Step {step + 1} of {STEPS.length}</span>
              <strong>{STEPS[step][1]}</strong>
            </div>
            <span>{STEPS[step][0]} / MMXXVI</span>
          </div>

          {step === 0 ? (
            <fieldset className={styles.routeFieldset}>
              <legend id="intake-step-title">What brings you to ZEN?</legend>
              <p>Choose the closest route. The brief can still cover more than one need.</p>
              <div className={styles.routeGrid}>
                {AUDIENCES.map((audience) => (
                  <label key={audience.value} data-selected={draft.audience === audience.value}>
                    <input
                      type="radio"
                      name="audience"
                      value={audience.value}
                      checked={draft.audience === audience.value}
                      onChange={() => update("audience", audience.value)}
                    />
                    <span>{audience.code}</span>
                    <strong>{audience.title}</strong>
                    <small>{audience.copy}</small>
                    <i aria-hidden="true">→</i>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <fieldset className={styles.formFieldset}>
              <legend id="intake-step-title">Who should this brief describe?</legend>
              <p>Required fields are marked. These details are not sent automatically.</p>
              <div className={styles.fieldGrid}>
                <label>
                  <span>Your name *</span>
                  <input
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={draft.contactName}
                    onChange={(event) => update("contactName", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Email *</span>
                  <input
                    type="email"
                    autoComplete="email"
                    maxLength={180}
                    value={draft.email}
                    onChange={(event) => update("email", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Role</span>
                  <input
                    type="text"
                    autoComplete="organization-title"
                    maxLength={120}
                    value={draft.role}
                    onChange={(event) => update("role", event.target.value)}
                  />
                </label>
                <label>
                  <span>Organization {requiresOrganization ? "*" : ""}</span>
                  <input
                    type="text"
                    autoComplete="organization"
                    maxLength={160}
                    value={draft.organizationName}
                    onChange={(event) => update("organizationName", event.target.value)}
                    required={requiresOrganization}
                  />
                </label>
                <label>
                  <span>Industry or field</span>
                  <input
                    type="text"
                    maxLength={120}
                    value={draft.industry}
                    onChange={(event) => update("industry", event.target.value)}
                  />
                </label>
                <label>
                  <span>Website</span>
                  <input
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://"
                    maxLength={240}
                    value={draft.website}
                    onChange={(event) => update("website", event.target.value)}
                  />
                </label>
                <label>
                  <span>Location</span>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    maxLength={140}
                    value={draft.location}
                    onChange={(event) => update("location", event.target.value)}
                  />
                </label>
                <label>
                  <span>Operating model</span>
                  <select
                    value={draft.operatingModel}
                    onChange={(event) => update("operatingModel", event.target.value as OperatingModel | "")}
                  >
                    <option value="">Select one</option>
                    <option value="solo">Solo</option>
                    <option value="small_team">Small team</option>
                    <option value="multi_location">Multi-location</option>
                    <option value="enterprise_unit">Enterprise unit</option>
                  </select>
                </label>
              </div>
              <div className={styles.inlineChoice}>
                <span>Who is the work for?</span>
                <label>
                  <input
                    type="radio"
                    name="purpose"
                    checked={draft.purpose === "own_business"}
                    onChange={() => update("purpose", "own_business")}
                  />
                  Our own organization
                </label>
                <label>
                  <input
                    type="radio"
                    name="purpose"
                    checked={draft.purpose === "client_build"}
                    onChange={() => update("purpose", "client_build")}
                  />
                  A client we support
                </label>
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset className={styles.formFieldset}>
              <legend id="intake-step-title">What capability needs to exist?</legend>
              <p>Describe the outcome in plain language. Arsenal can refine the implementation later.</p>
              <div className={styles.longFields}>
                <label>
                  <span>Primary goal *</span>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="What should be measurably better?"
                    value={draft.primaryGoal}
                    onChange={(event) => update("primaryGoal", event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Biggest friction</span>
                  <textarea
                    rows={3}
                    maxLength={700}
                    placeholder="Where does work slow down, repeat, get lost, or depend on one person?"
                    value={draft.biggestFriction}
                    onChange={(event) => update("biggestFriction", event.target.value)}
                  />
                </label>
                <label>
                  <span>Desired outcome</span>
                  <textarea
                    rows={3}
                    maxLength={700}
                    placeholder="What should a successful first version produce?"
                    value={draft.desiredOutcome}
                    onChange={(event) => update("desiredOutcome", event.target.value)}
                  />
                </label>
              </div>
              <div className={styles.checkGroup}>
                <span>Systems already in use</span>
                <div>
                  {SYSTEM_OPTIONS.map((system) => (
                    <label key={system}>
                      <input
                        type="checkbox"
                        checked={draft.systemsUsed.includes(system)}
                        onChange={() => toggle("systemsUsed", system)}
                      />
                      {system}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.checkGroup}>
                <span>Preferred delivery channels</span>
                <div>
                  {CHANNEL_OPTIONS.map((channel) => (
                    <label key={channel}>
                      <input
                        type="checkbox"
                        checked={draft.preferredChannels.includes(channel)}
                        onChange={() => toggle("preferredChannels", channel)}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </div>
              <label className={styles.timelineField}>
                <span>Timing</span>
                <select value={draft.timeline} onChange={(event) => update("timeline", event.target.value)}>
                  <option value="">Select one</option>
                  <option value="Exploring">Exploring</option>
                  <option value="Within 30 days">Within 30 days</option>
                  <option value="This quarter">This quarter</option>
                  <option value="Later this year">Later this year</option>
                </select>
              </label>
            </fieldset>
          ) : null}

          {step === 3 ? (
            <div className={styles.review}>
              <div className={styles.reviewHead}>
                <span className={styles.kicker}>Prepared arrival brief</span>
                <h2 id="intake-step-title">Context that can travel.</h2>
                <p>
                  Review the brief below. Emailing it sends your answers through
                  your own email client. Continuing to Arsenal never places the
                  brief or personal information in the URL.
                </p>
              </div>
              <textarea
                className={styles.brief}
                aria-label="Generated ZEN arrival brief"
                value={brief}
                readOnly
                rows={20}
              />
              <div className={styles.reviewActions}>
                <a className={styles.primaryAction} href={emailHref}>
                  Email this brief to ZEN →
                </a>
                <button type="button" onClick={copyBrief}>
                  Copy brief
                </button>
                {destination ? (
                  <a href={destination.href} target="_blank" rel="noopener noreferrer">
                    {destination.label}
                  </a>
                ) : null}
              </div>
              <p className={styles.copyStatus} aria-live="polite">
                {copyState === "copied"
                  ? "Brief copied."
                  : copyState === "failed"
                    ? "Copy was blocked. Select the brief above and copy it manually."
                    : destination?.note ??
                      "ZEN will review the context before recommending a next step."}
              </p>
              <div className={styles.honestState}>
                <strong>What this does</strong>
                <span>Prepares a reviewable brief and a safe destination.</span>
                <strong>What this does not do</strong>
                <span>
                  It does not automatically create a Business Space, update an
                  Arsenal profile, purchase a plan, or authorize autonomous work.
                </span>
              </div>
            </div>
          ) : null}

          <div className={styles.controls}>
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                className={styles.continue}
                type="button"
                onClick={() => canContinue && setStep((current) => Math.min(STEPS.length - 1, current + 1))}
                disabled={!canContinue}
              >
                Continue →
              </button>
            ) : (
              <button type="button" onClick={() => setStep(0)}>
                Start over
              </button>
            )}
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>ZEN AI Co. · Arrival instrument · Series MMXXVI</span>
        <Link href="/privacy-policy">Privacy</Link>
      </footer>
    </main>
  );
}
