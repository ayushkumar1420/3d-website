"use client";

import {
  ArrowUpRight,
  ArrowUp,
  Box,
  Layers3,
  MousePointer2,
  Gauge,
  Smartphone,
} from "lucide-react";
import type { CSSProperties } from "react";
import { flavors } from "@/data/flavors";
import Brand from "../ui/Brand";

type Props = { active: number; onSelect: (index: number) => void };

const details = [
  {
    icon: MousePointer2,
    title: "Made to be moved.",
    description:
      "Damped pointer and touch rotation give the can weight, presence, and a little attitude.",
  },
  {
    icon: Layers3,
    title: "One continuous story.",
    description:
      "Scroll drives the product from hero to detail, through disassembly and back into one piece.",
  },
  {
    icon: Box,
    title: "Five distinct worlds.",
    description:
      "Procedural labels, coordinated light, and custom particle geometry give each flavor its own character.",
  },
  {
    icon: Smartphone,
    title: "Energy, everywhere.",
    description:
      "Responsive staging, touch controls, and reduced-motion support keep the experience within reach.",
  },
  {
    icon: Gauge,
    title: "Built to run light.",
    description:
      "Instanced droplets, adaptive resolution, and locally generated textures keep the scene efficient.",
  },
];

export default function About({ active, onSelect }: Props) {
  return (
    <>
      <section className="next-flavor" aria-labelledby="next-heading">
        <span className="eyebrow">03 / KEEP YOUR OPTIONS WILD</span>
        <h2 id="next-heading">
          NEVER <span>ONE NOTE.</span>
        </h2>
        <p>
          Different moods. Different frequencies. Find the one that feels like
          you.
        </p>
        <div className="flavor-pills" aria-label="Explore another flavor">
          {flavors.map((flavor, index) => (
            <button
              key={flavor.id}
              onClick={() => {
                onSelect(index);
                document
                  .getElementById("home")
                  ?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                  });
              }}
              aria-pressed={index === active}
              style={{ "--flavor-color": flavor.color } as CSSProperties}
              data-cursor="EXPLORE"
            >
              <span />
              {flavor.shortName}
              <ArrowUpRight size={15} />
            </button>
          ))}
        </div>
      </section>
      <section
        className="about-section"
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="section-kicker">
          <span className="eyebrow">04 / BEHIND THE ENERGY</span>
          <span className="section-coordinate">
            AN INDEPENDENT CREATIVE EXPERIMENT
          </span>
        </div>
        <div className="about-intro">
          <h2 id="about-heading">
            BUILT FOR
            <br />
            THE WEB. <span>IN 3D.</span>
          </h2>
          <div>
            <p>
              A study in digital product storytelling. Real-time 3D, expressive
              motion, and considered interaction—working together to make you
              feel something.
            </p>
            <div className="tech-list">
              {[
                "Next.js",
                "TypeScript",
                "Three.js",
                "React Three Fiber",
                "Drei",
                "GSAP",
                "Motion",
                "WebGL",
              ].map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="craft-list">
          {details.map(({ icon: Icon, title, description }, index) => (
            <article key={title}>
              <span className="craft-number">0{index + 1}</span>
              <Icon size={23} strokeWidth={1} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="concept-disclosure">
          <span className="eyebrow">THE FINE PRINT</span>
          <p>
            VOLT is a fictional brand and an independent portfolio project
            inspired by energy-drink culture. No affiliation with Monster Energy
            or any beverage manufacturer. Product names, formulas, and
            nutritional values are illustrative.
          </p>
        </div>
      </section>
      <footer>
        <a href="#home" aria-label="Back to VOLT home">
          <Brand small />
        </a>
        <span>ALL ENERGY. NO ORDINARY.</span>
        <a href="#home" className="back-to-top">
          BACK TO TOP <ArrowUp size={14} />
        </a>
      </footer>
    </>
  );
}
