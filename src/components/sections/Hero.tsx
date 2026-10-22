"use client";

import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Pause,
  Play,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Flavor } from "@/data/flavors";

type Props = {
  flavor: Flavor;
  active: number;
  paused: boolean;
  onPause: () => void;
  onRotate: (direction: number) => void;
  reducedMotion: boolean;
};

export default function Hero({
  flavor,
  active,
  paused,
  onPause,
  onRotate,
  reducedMotion,
}: Props) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">
          <span className="live-dot" /> NOT FOR THE ORDINARY.
        </span>
        <span className="edition">THE ENERGY COLLECTION — VOL. 01</span>
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>UNLEASH</span>
          <span>
            THE <em>ENERGY.</em>
          </span>
        </h1>
        <p>
          For the restless. The fearless.
          <br />
          The ones who go all in.
        </p>
        <a href="#flavors" className="primary-button" data-cursor="ENTER">
          EXPLORE FLAVORS <ArrowUpRight size={19} />
        </a>
        <div className="hero-footnote">
          <span>FIVE DISTINCT FLAVORS</span>
          <span>ONE UNTAMED SPIRIT</span>
        </div>
      </div>
      <div className="background-word" aria-hidden="true">
        UNLIMITED
      </div>
      <div className="orbital-ring" aria-hidden="true">
        <span />
      </div>
      <div
        className="product-caption"
        id="flavor-panel"
        role="tabpanel"
        aria-labelledby={`flavor-${active}`}
      >
        <span className="eyebrow">
          <span className="tiny-line" /> IN THE SPOTLIGHT
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={flavor.id}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="product-number">
              0{active + 1}
              <span> / 05</span>
            </span>
            <h2>{flavor.name}</h2>
            <p>{flavor.taste}</p>
            <span className="product-volume">
              500 ML <span>·</span> PURE ATTITUDE
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero-bottom">
        <a href="#experience" className="scroll-hint">
          <span className="scroll-icon">
            <ArrowDown size={14} />
          </span>
          <span>SCROLL TO FEEL IT</span>
        </a>
        <div className="can-controls">
          <button
            className="rotate-button"
            onClick={() => onRotate(-1)}
            aria-label="Rotate can left"
          >
            <ChevronLeft size={14} />
          </button>
          <span>
            <MoveHorizontal size={15} /> DRAG TO EXPLORE
          </span>
          <button
            className="rotate-button"
            onClick={() => onRotate(1)}
            aria-label="Rotate can right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <button
          className="motion-toggle"
          onClick={onPause}
          aria-pressed={paused}
          aria-label={
            paused ? "Resume ambient animation" : "Pause ambient animation"
          }
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
          <span>{paused ? "MOTION PAUSED" : "LIVE IN 3D"}</span>
        </button>
      </div>
    </section>
  );
}
