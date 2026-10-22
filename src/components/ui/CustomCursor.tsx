"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (
      reducedMotion ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    let frame = 0;
    let shown = false;
    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    const move = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!shown) {
        shown = true;
        document.body.classList.add("has-custom-cursor");
      }
      const element = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], button, a",
      );
      const text =
        element?.dataset.cursor ??
        (element ? "GO" : (document.body.dataset.cursor ?? ""));
      if (label.current) label.current.textContent = text;
      cursor.current?.classList.toggle("expanded", Boolean(text));
      cursor.current?.classList.add("visible");
    };
    const leave = () => cursor.current?.classList.remove("visible");
    const animate = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      if (cursor.current)
        cursor.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    window.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [reducedMotion]);
  return (
    <div ref={cursor} className="custom-cursor" aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
