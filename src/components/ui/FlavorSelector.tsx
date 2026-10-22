"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { flavors } from "@/data/flavors";

type Props = { active: number; onSelect: (index: number) => void };

export default function FlavorSelector({ active, onSelect }: Props) {
  const touchStart = useRef({ x: 0, y: 0 });
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % flavors.length
        : event.key === "ArrowLeft"
          ? (index + flavors.length - 1) % flavors.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? flavors.length - 1
              : -1;
    if (next >= 0) {
      event.preventDefault();
      onSelect(next);
      document.getElementById(`flavor-${next}`)?.focus();
    }
  };
  return (
    <div className="flavor-dock" id="flavors">
      <div className="dock-heading">
        <span className="eyebrow">
          FIVE FLAVORS. <span className="muted">ZERO LIMITS.</span>
        </span>
        <span className="dock-instruction">
          FIND YOUR ENERGY <ArrowUpRight size={13} />
        </span>
      </div>
      <div
        className="flavor-options"
        role="tablist"
        aria-label="Choose your flavor"
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={(event) => {
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
            onSelect(
              (active + (dx < 0 ? 1 : flavors.length - 1)) % flavors.length,
            );
        }}
      >
        {flavors.map((flavor, index) => (
          <button
            id={`flavor-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls="flavor-panel"
            tabIndex={active === index ? 0 : -1}
            key={flavor.id}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => keyboard(event, index)}
            className={`flavor-option ${active === index ? "active" : ""}`}
            style={{ "--flavor-color": flavor.color } as CSSProperties}
            data-cursor="EXPLORE"
          >
            <span className="flavor-number">0{index + 1}</span>
            <span className="flavor-swatch" />
            <span className="flavor-option-copy">
              <strong>{flavor.shortName}</strong>
              <span>{flavor.personality}</span>
            </span>
            <span className="flavor-check">
              {active === index ? (
                <Check size={14} />
              ) : (
                <ArrowUpRight size={14} />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
