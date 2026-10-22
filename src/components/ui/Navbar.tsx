"use client";

import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Brand from "./Brand";

type Props = { sound: boolean; onSound: () => void };

export default function Navbar({ sound, onSound }: Props) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        !menu.current?.contains(event.target as Node) &&
        !toggle.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="navbar">
      <a href="#home" className="brand-link" aria-label="VOLT home">
        <Brand />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#flavors">
          The flavors<span>05</span>
        </a>
        <a href="#experience">The experience</a>
        <a href="#about">Behind the energy</a>
      </nav>
      <div className="nav-actions">
        <button
          className="sound-button"
          onClick={onSound}
          aria-pressed={sound}
          aria-label={`Turn sound ${sound ? "off" : "on"}`}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>SOUND {sound ? "ON" : "OFF"}</span>
        </button>
        <button
          ref={toggle}
          className="icon-button menu-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="menu-panel"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <div className="menu-panel" id="menu-panel" ref={menu}>
          <span className="eyebrow">FIND YOUR FREQUENCY</span>
          <nav aria-label="Expanded navigation">
            {[
              ["#flavors", "The flavors"],
              ["#experience", "The experience"],
              ["#about", "Behind the energy"],
            ].map(([href, text], i) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                <span>0{i + 1}</span>
                {text}
                <span>↗</span>
              </a>
            ))}
          </nav>
          <p>Five flavors. No limits.</p>
        </div>
      )}
    </header>
  );
}
