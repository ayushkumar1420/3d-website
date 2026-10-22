"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { CAN_VOLUME, PROFILE_LABELS, type Flavor } from "@/data/flavors";

type Props = { flavor: Flavor; active: number; reducedMotion: boolean };

export default function FlavorExperience({
  flavor,
  active,
  reducedMotion,
}: Props) {
  return (
    <>
      <section
        id="experience"
        className="story-section flavor-story"
        aria-labelledby="flavor-heading"
      >
        <div className="section-kicker">
          <span className="eyebrow">01 / FIND YOUR FREQUENCY</span>
          <span className="section-coordinate">
            A DIFFERENT KIND OF ENERGY <ArrowDownRight size={15} />
          </span>
        </div>
        <div className="story-label" aria-hidden="true">
          <span>500</span>
          <span>ML OF POSSIBILITY</span>
        </div>
        <div className="flavor-detail">
          <AnimatePresence mode="wait">
            <motion.div
              key={flavor.id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="eyebrow accent">FLAVOR 0{active + 1} / 05</span>
              <h2 id="flavor-heading">
                {flavor.name.split(" ").slice(0, -1).join(" ")}
                <br />
                <span>{flavor.name.split(" ").at(-1)}.</span>
              </h2>
              <h3>{flavor.tagline}</h3>
              <p className="description">{flavor.description}</p>
              <div className="flavor-notes">
                {flavor.notes.map((note) => (
                  <span key={note}>
                    <Plus size={11} />
                    {note}
                  </span>
                ))}
              </div>
              <div className="taste-profile" aria-label="Taste profile">
                {PROFILE_LABELS.map((label, index) => (
                  <div className="profile-row" key={label}>
                    <span>{label}</span>
                    <div
                      className="profile-track"
                      role="meter"
                      aria-label={label}
                      aria-valuemin={0}
                      aria-valuemax={10}
                      aria-valuenow={flavor.profile[index]}
                    >
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${flavor.profile[index] * 10}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.8,
                          delay: index * 0.1,
                        }}
                      />
                    </div>
                    <span>
                      {flavor.profile[index]}
                      <small>/10</small>
                    </span>
                  </div>
                ))}
              </div>
              <div className="product-specs">
                <div>
                  <strong>
                    {flavor.caffeine}
                    <small>mg</small>
                  </strong>
                  <span>CAFFEINE / CAN</span>
                </div>
                <div>
                  <strong>
                    {CAN_VOLUME}
                    <small>ml</small>
                  </strong>
                  <span>FULL-SIZE ENERGY</span>
                </div>
                <div>
                  <strong>
                    B<small>3 + 6 + 12</small>
                  </strong>
                  <span>VITAMIN BLEND</span>
                </div>
              </div>
              <p className="concept-note">
                Concept formula and illustrative taste ratings. VOLT is a
                fictional beverage.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      <section
        className="story-section anatomy-story"
        id="inside"
        aria-labelledby="anatomy-heading"
      >
        <div className="section-kicker">
          <span className="eyebrow">02 / EVERY DETAIL. FULLY CHARGED.</span>
          <span className="section-coordinate">
            SCROLL TO DISASSEMBLE <ArrowDownRight size={15} />
          </span>
        </div>
        <div className="anatomy-content">
          <span className="eyebrow accent">MORE THAN MEETS THE EYE</span>
          <h2 id="anatomy-heading">
            GOOD ENERGY.
            <br />
            <span>BY DESIGN.</span>
          </h2>
          <p>
            A familiar silhouette. A different perspective.
            <br />
            Get a little closer to what makes VOLT.
          </p>
          <div className="anatomy-notes">
            <div>
              <span className="annotation-index">01</span>
              <div>
                <h3>Crack into possibility.</h3>
                <p>
                  A sculpted pull tab, rolled rim, and brushed metal lid. Small
                  details. A satisfying whole.
                </p>
              </div>
              <ArrowUpRight size={16} />
            </div>
            <div>
              <span className="annotation-index">02</span>
              <div>
                <h3>Wear your energy.</h3>
                <p>
                  Five original label designs, wrapped around one seamless
                  aluminum-inspired shell.
                </p>
              </div>
              <ArrowUpRight size={16} />
            </div>
            <div>
              <span className="annotation-index">03</span>
              <div>
                <h3>Nothing ordinary inside.</h3>
                <p>
                  {flavor.highlights.join(" · ")}. A concept blend with a
                  character all its own.
                </p>
              </div>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <span className="concept-note">
            Exploded view is an artistic interpretation of the 3D model.
          </span>
        </div>
      </section>
    </>
  );
}
