import Image from "next/image";
import styles from "./company-portfolio.module.css";

const LINKS = {
  arsenal: "https://arsenal.world",
  businessSpace:
    "https://arsenal.world/login?next=%2Fbusiness-spaces%2Fnew&utm_source=zenai.world&utm_medium=owned&utm_campaign=business_space_intake",
  pioneer: "https://arsenal.world/programs/pioneer",
  vanguard: "https://arsenal.world/programs/vanguard",
  start: "/start",
  constitution: "/ai-literacy-constitution",
} as const;

const BUSINESS_CAPABILITIES = [
  {
    code: "SBS-01",
    title: "Custom Agentic Solutions",
    copy: "Purpose-built agents and operating systems shaped around an organization’s goals, context, and real work.",
  },
  {
    code: "SBS-02",
    title: "Intelligent Automation",
    copy: "Connected workflows that reduce manual friction and move important work from instruction to action.",
  },
  {
    code: "SBS-03",
    title: "AI Strategy & Systems Integration",
    copy: "Practical architecture that connects intelligence, people, information, and execution without surrendering human control.",
  },
] as const;

const PROGRAMS = [
  {
    code: "01 / NATIONAL FIRST",
    title: "AI Pioneer Program",
    category: "Youth AI literacy",
    copy: "The first youth AI literacy program in United States history.",
    href: LINKS.pioneer,
    tone: "historic",
  },
  {
    code: "02 / EMERGING SYSTEMS",
    title: "Vanguard Program",
    category: "Web3 literacy",
    copy: "ZEN AI Co.’s Web3 literacy program for understanding a new generation of digital systems.",
    href: LINKS.vanguard,
    tone: "vanguard",
  },
  {
    code: "03 / HOME LEARNING",
    title: "ZEN Homeschool Kit",
    category: "Family capability",
    copy: "ZEN AI Co.’s AI literacy offering for homeschool families and learning communities.",
    href: LINKS.start,
    tone: "home",
  },
  {
    code: "04 / MULTIPLIER PATH",
    title: "Train-a-Trainer",
    category: "Educator advancement",
    copy: "ZEN AI Co.’s program for preparing educators, leaders, and facilitators to deliver AI literacy.",
    href: LINKS.start,
    tone: "trainer",
  },
] as const;

function externalLinkProps(href: string) {
  return href.startsWith("https://")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

export default function CompanyPortfolio() {
  return (
    <section
      id="solutions"
      className={styles.portfolio}
      aria-labelledby="company-portfolio-title"
    >
      <div className={styles.securityField} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className={styles.frame} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.shell}>
        <header className={styles.register} data-reveal>
          <span>ZEN AI CO. / CAPABILITY PORTFOLIO</span>
          <strong>SERIES MMXXVI</strong>
          <span>ISSUANCE Z–02 / HUMAN ADVANCEMENT</span>
        </header>

        <div className={styles.introduction} data-reveal>
          <div>
            <span className={styles.eyebrow}>The complete company instrument</span>
            <h2 id="company-portfolio-title">
              Two divisions.
              <span>One mission.</span>
            </h2>
          </div>
          <div className={styles.mission}>
            <strong>Build the systems. Prepare the people.</strong>
            <p>
              ZEN AI Co. advances organizations through Smart Business
              Solutions and advances human capability through landmark literacy
              and advancement programs.
            </p>
          </div>
        </div>

        <div className={styles.divisionIndex} data-reveal aria-label="ZEN company portfolio at a glance">
          <div>
            <span>02</span>
            <strong>operating divisions</strong>
            <small>Solutions + Programs</small>
          </div>
          <div>
            <span>04</span>
            <strong>named program pathways</strong>
            <small>People + Communities</small>
          </div>
          <div>
            <span>01</span>
            <strong>agentic operating platform</strong>
            <small>Arsenal</small>
          </div>
          <div>
            <span>∞</span>
            <strong>human possibility</strong>
            <small>The horizon</small>
          </div>
        </div>

        <article className={styles.businessInstrument} data-reveal>
          <div className={styles.businessThread} aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className={styles.businessHeader}>
            <span>DIVISION 01 / ORGANIZATIONAL CAPABILITY</span>
            <strong>SMART BUSINESS SOLUTIONS</strong>
            <span>ZEN–SBS–0001</span>
          </div>

          <div className={styles.businessGrid}>
            <div className={styles.businessCopy}>
              <span className={styles.darkEyebrow}>The intelligence-to-execution division</span>
              <h3>Smart Business Solutions</h3>
              <p>
                ZEN designs intelligent systems around the way an organization
                actually operates—turning fragmented tasks, information, and
                decisions into coordinated capability.
              </p>
              <div className={styles.capabilityList}>
                {BUSINESS_CAPABILITIES.map((capability) => (
                  <div key={capability.code}>
                    <span>{capability.code}</span>
                    <div>
                      <h4>{capability.title}</h4>
                      <p>{capability.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a className={styles.businessCta} href={LINKS.start}>
                Design a business solution <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className={styles.arsenalInstrument}>
              <div className={styles.arsenalOrbits} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={styles.arsenalSerial}>
                <span>THE EXECUTION INFRASTRUCTURE</span>
                <span>A–00000001–Z</span>
              </div>
              <div className={styles.arsenalMark}>
                <Image
                  src="/zen-mark.png"
                  alt="ZEN AI Co."
                  width={176}
                  height={176}
                  unoptimized
                />
              </div>
              <span className={styles.arsenalLabel}>ZEN AI CO. PRESENTS</span>
              <h4>Arsenal</h4>
              <p>
                ZEN AI Co.’s agentic platform and the operating foundation of
                Smart Business Solutions—where agents, workflows, files,
                Business Spaces, and deployable systems come together.
              </p>
              <div className={styles.arsenalCapabilities}>
                <span>Agents</span>
                <span>Workflows</span>
                <span>Business Spaces</span>
                <span>Deployment</span>
              </div>
              <div className={styles.arsenalActions}>
                <a href={LINKS.arsenal} {...externalLinkProps(LINKS.arsenal)}>
                  Enter Arsenal <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={LINKS.businessSpace}
                  {...externalLinkProps(LINKS.businessSpace)}
                >
                  Create a Business Space <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className={styles.arsenalFooter} aria-hidden="true">
                BUILD / AUTOMATE / OPERATE / ADVANCE
              </div>
            </div>
          </div>
        </article>

        <div id="programs" className={styles.programRegistry}>
          <div className={styles.programHeader} data-reveal>
            <div>
              <span className={styles.eyebrow}>Division 02 / human capability</span>
              <h3>Literacy &amp; Advancement Programs</h3>
            </div>
            <p>
              ZEN develops programs that expand AI and Web3 literacy for youth,
              families, educators, and communities—so progress reaches beyond
              the technology itself.
            </p>
          </div>

          <div className={styles.programGrid}>
            {PROGRAMS.map((program, index) => (
              <a
                className={`${styles.programCard} ${styles[program.tone]}`}
                href={program.href}
                key={program.code}
                {...externalLinkProps(program.href)}
                data-reveal
              >
                <div className={styles.programCardFrame} aria-hidden="true" />
                <div className={styles.programCardHead}>
                  <span>{program.code}</span>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </div>
                <div className={styles.programRosette} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <strong>{index + 1}</strong>
                </div>
                <span className={styles.programCategory}>{program.category}</span>
                <h4>{program.title}</h4>
                <p>{program.copy}</p>
                <strong className={styles.programAction}>
                  Explore the pathway <span aria-hidden="true">→</span>
                </strong>
                <small className={styles.programMicrotype} aria-hidden="true">
                  ZEN AI CO. / KNOWLEDGE INTO AGENCY / SERIES MMXXVI
                </small>
              </a>
            ))}
          </div>
        </div>

        <a
          className={styles.constitutionBand}
          href={LINKS.constitution}
          data-reveal
        >
          <div className={styles.constitutionSeal} aria-hidden="true">
            <span />
            <span />
            <strong>AI</strong>
          </div>
          <div>
            <span>THE PUBLIC FOUNDATION</span>
            <h3>AI Literacy Constitution</h3>
            <p>
              The public principles that anchor ZEN AI Co.’s approach to AI
              literacy, human agency, and responsible advancement.
            </p>
          </div>
          <strong>
            Read the living document <span aria-hidden="true">→</span>
          </strong>
        </a>

        <footer className={styles.advancementRail} data-reveal>
          <span>THE ADVANCEMENT HORIZON</span>
          <div>
            <strong>People</strong>
            <i aria-hidden="true">◆</i>
            <strong>Organizations</strong>
            <i aria-hidden="true">◆</i>
            <strong>Communities</strong>
            <i aria-hidden="true">◆</i>
            <strong>Human possibility</strong>
          </div>
          <span>INTELLIGENCE INTO CAPABILITY</span>
        </footer>
      </div>
    </section>
  );
}
