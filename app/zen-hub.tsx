"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LINKS = {
  arsenal: "https://arsenal.world",
  pioneer: "https://aipioneer.zen.ai/",
  arena: "https://us.zenai.biz/guest",
  cards: "https://www.zenai.world/legacydossier",
  github: "https://github.com/Bluenot3",
  linkedin: "https://www.linkedin.com/company/z3nai/",
  x: "https://x.com/ZEN_AGI",
  youtube: "https://www.youtube.com/@ZENAIML",
  contact:
    "mailto:huxley@zenai.biz?subject=ZEN%20AI%20Co.%20partnership%20inquiry",
} as const;

const ROUTES = [
  {
    index: "01",
    verb: "Learn",
    title: "AI Pioneer",
    detail: "Ages 11–18 build, deploy, showcase, and prove real AI work.",
    href: LINKS.pioneer,
    signal: "Youth capability",
    tone: "aqua",
  },
  {
    index: "02",
    verb: "Build",
    title: "Arsenal",
    detail: "Agents, automations, files, programs, and operating systems in one place.",
    href: LINKS.arsenal,
    signal: "Execution layer",
    tone: "violet",
  },
  {
    index: "03",
    verb: "Explore",
    title: "AI Arena",
    detail: "Enter as a guest and compare the frontier models available to you.",
    href: LINKS.arena,
    signal: "Model access",
    tone: "gold",
  },
  {
    index: "04",
    verb: "Verify",
    title: "ZEN Proof",
    detail: "Projects, portfolios, credentials, and portable proof of capability.",
    href: LINKS.cards,
    signal: "Proof layer",
    tone: "emerald",
  },
] as const;

const LEDGER = [
  {
    heading: "Learn",
    copy: "Project-first AI pathways",
    links: [
      ["AI Pioneer", LINKS.pioneer],
      ["Programs in Arsenal", LINKS.arsenal],
    ],
  },
  {
    heading: "Build",
    copy: "From prompt to working system",
    links: [
      ["Arsenal", LINKS.arsenal],
      ["AI Arena", LINKS.arena],
      ["ZEN GitHub", LINKS.github],
    ],
  },
  {
    heading: "Prove",
    copy: "Evidence that travels",
    links: [
      ["Legacy Dossier", LINKS.cards],
      ["Credential pathway", LINKS.arsenal],
    ],
  },
  {
    heading: "Connect",
    copy: "Bring ZEN to your community",
    links: [
      ["Partner with ZEN", LINKS.contact],
      ["LinkedIn", LINKS.linkedin],
      ["YouTube", LINKS.youtube],
      ["X / Twitter", LINKS.x],
    ],
  },
] as const;

function GuillocheField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0.72;
    let pointerY = 0.38;
    let targetX = pointerX;
    let targetY = pointerY;
    let lastDraw = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const trackPointer = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
    };

    const drawRosette = (
      centerX: number,
      centerY: number,
      radius: number,
      phase: number,
    ) => {
      const rings = width < 700 ? 18 : 34;

      for (let ring = 0; ring < rings; ring += 1) {
        const normalized = ring / rings;
        context.beginPath();
        const points = 220;

        for (let point = 0; point <= points; point += 1) {
          const theta = (point / points) * Math.PI * 2;
          const lace =
            Math.sin(theta * (9 + (ring % 5)) + phase + ring * 0.17) *
            radius *
            (0.038 + normalized * 0.018);
          const orbit =
            Math.sin(theta * 3 - phase * 0.42 + ring * 0.31) *
            radius *
            0.015;
          const currentRadius =
            radius * (0.22 + normalized * 0.78) + lace + orbit;
          const x = centerX + Math.cos(theta) * currentRadius * 1.03;
          const y = centerY + Math.sin(theta) * currentRadius;

          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const hue = ring % 3 === 0 ? "108, 238, 210" : "245, 207, 112";
        context.strokeStyle = `rgba(${hue}, ${0.055 + normalized * 0.1})`;
        context.lineWidth = ring % 7 === 0 ? 0.95 : 0.55;
        context.stroke();
      }
    };

    const draw = (time: number) => {
      if (!reducedMotion && time - lastDraw < 28) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      context.clearRect(0, 0, width, height);
      const phase = reducedMotion ? 0 : time * 0.00013;
      const lineCount = width < 700 ? 28 : 52;
      const step = Math.max(7, width / 190);

      for (let line = 0; line < lineCount; line += 1) {
        const baseY = (height / (lineCount - 1)) * line;
        context.beginPath();

        for (let x = -20; x <= width + 20; x += step) {
          const normalizedX = x / Math.max(width, 1);
          const proximity =
            1 -
            Math.min(
              1,
              Math.abs(normalizedX - pointerX) * 1.8 +
                Math.abs(baseY / height - pointerY) * 0.72,
            );
          const wave =
            Math.sin(normalizedX * Math.PI * 6.2 + line * 0.28 + phase) *
              (8 + proximity * 27) +
            Math.sin(normalizedX * Math.PI * 14 - line * 0.17 - phase * 1.7) *
              (2.5 + proximity * 7);
          const y = baseY + wave;
          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const warm = line > lineCount * 0.48;
        context.strokeStyle = warm
          ? `rgba(243, 207, 112, ${0.045 + (line / lineCount) * 0.08})`
          : `rgba(96, 229, 213, ${0.05 + (1 - line / lineCount) * 0.08})`;
        context.lineWidth = line % 9 === 0 ? 0.9 : 0.52;
        context.stroke();
      }

      const sealX = width < 900 ? width * 0.71 : width * 0.77;
      const sealY = height * 0.36;
      drawRosette(
        sealX + (pointerX - 0.5) * 16,
        sealY + (pointerY - 0.5) * 14,
        Math.min(width, height) * (width < 700 ? 0.3 : 0.37),
        phase,
      );

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", trackPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="guilloche-field" aria-hidden="true" />;
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="ZEN AI Co. home">
      <span className="brand-mark">
        <Image
          src="/zen-mark.png"
          alt=""
          width={42}
          height={42}
          unoptimized
          priority
        />
      </span>
      <span>
        <strong>ZEN AI Co.</strong>
        <small>Intelligence · Infrastructure · Proof</small>
      </span>
    </a>
  );
}

function RouteMark({ index }: { index: string }) {
  return (
    <span className="route-mark" aria-hidden="true">
      <span>{index}</span>
    </span>
  );
}

function DestinationDrawer({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close, open]);

  return (
    <div
      className={`destination-drawer ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      <button
        className="drawer-backdrop"
        type="button"
        onClick={close}
        aria-label="Close destination map"
      />
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="ZEN destination map"
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">ZEN command map</span>
            <h2>Where do you want to go?</h2>
          </div>
          <button className="close-button" type="button" onClick={close}>
            Close
          </button>
        </div>
        <div className="drawer-ledger">
          {LEDGER.map((group) => (
            <section key={group.heading} className="drawer-group">
              <div>
                <span>{group.heading}</span>
                <p>{group.copy}</p>
              </div>
              <div className="drawer-links">
                {group.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                  >
                    {label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="drawer-serial">
          ZEN · SERIES MMXXVI · BUILD WHAT MATTERS · PROVE WHAT YOU BUILT
        </div>
      </aside>
    </div>
  );
}

export default function ZenHub() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="site-shell">
      <GuillocheField />
      <div className="paper-grain" aria-hidden="true" />
      <div className="hologram-wash" aria-hidden="true" />

      <header className="topbar">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary">
          <a href="#routes">Choose a path</a>
          <a href="#ledger">Ecosystem</a>
          <a href={LINKS.contact}>Partner</a>
        </nav>
        <div className="topbar-actions">
          <button
            className="map-button"
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            <span aria-hidden="true">⌁</span>
            Map
          </button>
          <a
            className="primary-button primary-button--small"
            href={LINKS.arsenal}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter Arsenal <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="note-frame" aria-hidden="true">
          <span className="corner corner--tl">Z</span>
          <span className="corner corner--tr">AI</span>
          <span className="corner corner--bl">03</span>
          <span className="corner corner--br">26</span>
        </div>
        <div className="security-thread" aria-hidden="true">
          <span>ZEN · VERIFIED CAPABILITY · ZEN · VERIFIED CAPABILITY</span>
        </div>

        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            ZEN sovereign intelligence treasury · Series 2026
          </span>
          <h1>
            Intelligence is abundant.
            <span>Capability is sovereign.</span>
          </h1>
          <p>
            ZEN AI Co. is the gateway from learning AI to building real systems
            and carrying proof of what you can do.
          </p>
          <div className="hero-actions">
            <a
              className="primary-button"
              href={LINKS.arsenal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Build in Arsenal <span aria-hidden="true">↗</span>
            </a>
            <a
              className="secondary-button"
              href={LINKS.pioneer}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore AI Pioneer
            </a>
          </div>
          <div className="proof-line">
            <span>
              <strong>Learn</strong> build-first pathways
            </span>
            <span>
              <strong>Build</strong> agents and systems
            </span>
            <span>
              <strong>Prove</strong> real capability
            </span>
          </div>
        </div>

        <div className="sovereign-seal" aria-label="ZEN capability seal">
          <div className="seal-orbit seal-orbit--outer" aria-hidden="true" />
          <div className="seal-orbit seal-orbit--inner" aria-hidden="true" />
          <div className="seal-type seal-type--top" aria-hidden="true">
            SOVEREIGN INTELLIGENCE
          </div>
          <div className="seal-type seal-type--bottom" aria-hidden="true">
            BUILD · VERIFY · ADVANCE
          </div>
          <a
            className="seal-core"
            href={LINKS.arsenal}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enter Arsenal"
          >
            <Image
              src="/zen-mark.png"
              alt="ZEN AI Co."
              width={170}
              height={170}
              unoptimized
              priority
            />
            <span>Enter the ecosystem</span>
          </a>
          <span className="seal-star seal-star--one" aria-hidden="true">
            ✦
          </span>
          <span className="seal-star seal-star--two" aria-hidden="true">
            ✦
          </span>
        </div>

        <div className="hero-serial" aria-hidden="true">
          <span>A 00000001 Z</span>
          <span>LEGAL TENDER FOR HUMAN CAPABILITY</span>
          <span>EST. MMXXIII</span>
        </div>
      </section>

      <section id="routes" className="routes-section">
        <div className="section-intro">
          <span className="eyebrow">Four doors. One ecosystem.</span>
          <h2>Choose what you came to do.</h2>
          <p>
            Every click has a destination. No dead cards, no maze, no generic
            “learn more.”
          </p>
        </div>
        <div className="route-grid">
          {ROUTES.map((route) => (
            <a
              className={`route-card route-card--${route.tone}`}
              href={route.href}
              key={route.index}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="route-card-head">
                <RouteMark index={route.index} />
                <span className="route-signal">{route.signal}</span>
              </div>
              <div>
                <span className="route-verb">{route.verb}</span>
                <h3>{route.title}</h3>
                <p>{route.detail}</p>
              </div>
              <span className="route-enter">
                Enter <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="ledger" className="ledger-section">
        <div className="ledger-frame">
          <div className="ledger-copy">
            <span className="eyebrow">The ZEN standard</span>
            <h2>Real work creates its own currency.</h2>
            <p>
              Learning, building, files, deployment, and proof stay connected
              across the ZEN ecosystem—so capability can be seen, shared, and
              trusted.
            </p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setDrawerOpen(true)}
            >
              Open destination map
            </button>
          </div>
          <div className="capability-ledger">
            {[
              ["01", "Learn", "AI Pioneer · Vanguard"],
              ["02", "Build", "Arsenal · Agents · Files"],
              ["03", "Deploy", "Apps · Automations · Systems"],
              ["04", "Prove", "Projects · Credentials · Zen Cards"],
            ].map(([number, title, detail]) => (
              <div className="ledger-row" key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <small>{detail}</small>
                <i aria-hidden="true">✓</i>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <Brand />
        <p>Learn AI. Build what matters. Prove what you can do.</p>
        <div className="footer-actions">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href={LINKS.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href={LINKS.contact}>Contact</a>
        </div>
        <span className="footer-serial">
          © MMXXVI ZEN AI CO. · SOVEREIGN CAPABILITY INFRASTRUCTURE
        </span>
      </footer>

      <div className="mobile-dock">
        <a href={LINKS.arsenal} target="_blank" rel="noopener noreferrer">
          Enter Arsenal <span aria-hidden="true">↗</span>
        </a>
        <button type="button" onClick={() => setDrawerOpen(true)}>
          ZEN Map
        </button>
      </div>

      <DestinationDrawer
        open={drawerOpen}
        close={() => setDrawerOpen(false)}
      />
    </main>
  );
}
