import Link from "next/link";
import styles from "./gateway-expansion.module.css";

const OPERATING_RECORD = [
  {
    value: "4",
    label: "published learning modules",
    detail: "The current AI Pioneer path moves from fundamentals to portfolio proof.",
  },
  {
    value: "8",
    label: "guided learning sections",
    detail: "Vocabulary, practice, checkpoints, and build work stay connected.",
  },
  {
    value: "6",
    label: "practical build formats",
    detail: "Prompts, images, apps, sources, model thinking, and project proof.",
  },
  {
    value: "4",
    label: "ecosystem entry routes",
    detail: "Learn, advance, build, or begin a structured ZEN engagement.",
  },
] as const;

const PUBLIC_RECORD = [
  {
    code: "A-01",
    title: "Accomplishments",
    copy: "Completed work, milestones, credentials, and evidence that can be verified.",
    href: "/work?category=accomplishments",
  },
  {
    code: "I-02",
    title: "Initiatives",
    copy: "Programs and public-interest efforts moving from intent into operation.",
    href: "/work?category=initiatives",
  },
  {
    code: "P-03",
    title: "Partnerships",
    copy: "Schools, communities, institutions, and collaborators building with ZEN.",
    href: "/work?category=partners",
  },
  {
    code: "K-04",
    title: "Public knowledge",
    copy: "Useful frameworks, explainers, standards, and source-backed learning material.",
    href: "/work?category=knowledge",
  },
] as const;

const TEAM_PRACTICE = [
  ["01", "Systems", "Turn intelligence into durable tools, platforms, and operating infrastructure."],
  ["02", "Learning", "Make AI understandable through guided practice and real creation."],
  ["03", "Programs", "Design pathways that connect participation, work, evidence, and advancement."],
  ["04", "Partnerships", "Build alongside schools, communities, businesses, and institutions."],
] as const;

export default function GatewayExpansion() {
  return (
    <div className={styles.expansion}>
      <section id="company" className={styles.company}>
        <div className={styles.companyFrame} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.companyCopy} data-reveal>
          <span className={styles.eyebrow}>Company register · ZEN AI Co.</span>
          <h2>A capability company for the intelligence era.</h2>
          <p>
            ZEN AI Co. connects AI literacy, practical building, agentic
            infrastructure, and public proof. The purpose is simple: help
            people and organizations understand the medium, make useful things,
            and retain agency over what happens next.
          </p>
          <div className={styles.companyActions}>
            <Link href="/start">Start with context <span aria-hidden="true">→</span></Link>
            <Link href="/ai-literacy-constitution">
              Read the AI Literacy Constitution <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className={styles.civicSeal} aria-hidden="true">
          <div className={styles.civicSealRays} />
          <div className={styles.civicSealOrbit} />
          <div className={styles.civicSealCore}>
            <strong>Z</strong>
            <span>Human agency</span>
          </div>
          <small>LEARN · BUILD · DEPLOY · PROVE</small>
        </div>
        <div className={styles.companyPrinciples} data-reveal>
          <div>
            <span>Purpose</span>
            <strong>Intelligence into capability</strong>
          </div>
          <div>
            <span>Method</span>
            <strong>Understand, build, verify</strong>
          </div>
          <div>
            <span>Standard</span>
            <strong>Human agency stays visible</strong>
          </div>
        </div>
      </section>

      <section id="impact" className={styles.impact}>
        <div className={styles.impactHeader} data-reveal>
          <div>
            <span className={styles.eyebrow}>Public impact ledger</span>
            <h2>Proof before proclamation.</h2>
          </div>
          <p>
            ZEN separates what is operating now from what is still being built.
            These figures describe the current published learning and gateway
            architecture—not an inflated claim about people served.
          </p>
        </div>
        <div className={styles.statBank}>
          {OPERATING_RECORD.map((item, index) => (
            <article key={item.label} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.value}</strong>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className={styles.recordHeader} data-reveal>
          <div>
            <span>Verified publication system</span>
            <h3>The public record grows when the evidence is ready.</h3>
          </div>
          <Link href="/work">Open the complete public record →</Link>
        </div>
        <div className={styles.recordGrid}>
          {PUBLIC_RECORD.map((item) => (
            <Link href={item.href} key={item.code} data-reveal>
              <span>{item.code}</span>
              <h4>{item.title}</h4>
              <p>{item.copy}</p>
              <strong>View ledger <i aria-hidden="true">→</i></strong>
            </Link>
          ))}
        </div>
      </section>

      <section id="team" className={styles.team}>
        <div className={styles.teamThread} aria-hidden="true">
          ZEN AI CO. · HUMAN-LED · COLLABORATOR-POWERED · SERIES 2026
        </div>
        <div className={styles.teamIntro} data-reveal>
          <span className={styles.eyebrow}>The people behind the system</span>
          <h2>Human-led by design.</h2>
          <p>
            ZEN is built through a network of operators, educators, builders,
            institutional collaborators, and community partners. The work is
            organized around clear responsibilities rather than an anonymous
            promise of automation.
          </p>
          <div className={styles.teamLinks}>
            <a
              href="https://www.linkedin.com/company/z3nai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet ZEN on LinkedIn ↗
            </a>
            <a href="mailto:huxley@zenai.biz?subject=ZEN%20AI%20Co.%20team%20and%20partnership%20inquiry">
              Contact the team →
            </a>
          </div>
        </div>
        <div className={styles.teamLedger}>
          {TEAM_PRACTICE.map(([number, title, copy]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.contact} data-reveal>
        <div className={styles.contactLines} aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
        </div>
        <div>
          <span className={styles.eyebrow}>Arrivals · guided routing</span>
          <h2>Tell us where capability needs to begin.</h2>
          <p>
            The ZEN intake gathers the operating context Arsenal needs for a
            stronger Business Space brief, or routes learners, educators,
            communities, and partners to the right next step.
          </p>
        </div>
        <div className={styles.contactActions}>
          <Link href="/start">Start the guided intake →</Link>
          <a href="mailto:huxley@zenai.biz?subject=ZEN%20AI%20Co.%20inquiry">
            Email ZEN directly
          </a>
        </div>
        <div className={styles.contactSerial} aria-hidden="true">
          <span>PORT OF ENTRY / ZENAI.WORLD</span>
          <span>NO. Z-ARRIVAL-0001</span>
        </div>
      </section>
    </div>
  );
}
