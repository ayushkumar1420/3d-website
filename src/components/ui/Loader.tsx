"use client";

import { motion, AnimatePresence } from "motion/react";
import Brand from "./Brand";

export default function Loader({ ready }: { ready: boolean }) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="loader"
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          role="status"
          aria-live="polite"
        >
          <Brand />
          <span className="eyebrow">CHARGING THE EXPERIENCE</span>
          <div className="loading-track">
            <span />
          </div>
          <span className="loading-note">
            A little anticipation. A lot of energy.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
