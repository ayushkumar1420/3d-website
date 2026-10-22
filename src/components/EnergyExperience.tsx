"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { flavors, TRANSITION_DURATION } from "@/data/flavors";
import type { SceneMotion } from "@/lib/scene";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Navbar from "./ui/Navbar";
import FlavorSelector from "./ui/FlavorSelector";
import CustomCursor from "./ui/CustomCursor";
import Loader from "./ui/Loader";
import Hero from "./sections/Hero";
import FlavorExperience from "./sections/FlavorExperience";
import About from "./sections/About";

const Experience = dynamic(() => import("./three/Experience"), { ssr: false });

export default function EnergyExperience() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [renderPaused, setRenderPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const scene = useRef<SceneMotion>({
    scroll: 0,
    transition: 0,
    spin: 0,
    rotation: 0,
    dragging: false,
    paused: false,
    reducedMotion: false,
  });
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const flavor = flavors[active];

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => {
    setFailed(true);
    setReady(true);
  }, []);

  useEffect(() => {
    scene.current.paused = paused;
    scene.current.reducedMotion = reducedMotion;
  }, [paused, reducedMotion]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      const detailTop =
        document.getElementById("experience")?.offsetTop ?? window.innerHeight;
      const insideTop =
        document.getElementById("inside")?.offsetTop ?? window.innerHeight * 2;
      const nextTop =
        document.querySelector<HTMLElement>(".next-flavor")?.offsetTop ??
        window.innerHeight * 3;
      const phase =
        y < detailTop
          ? y / detailTop
          : y < insideTop
            ? 1 + (y - detailTop) / (insideTop - detailTop)
            : 2 + (y - insideTop) / (nextTop - insideTop);
      scene.current.scroll = phase;
      const isMobile = window.innerWidth <= 760;
      let mobileShift = -y * 0.15;
      if (y >= insideTop - 300) mobileShift = insideTop - y - 150;
      else if (y >= detailTop) mobileShift = detailTop - y - 150;
      root.current?.style.setProperty("--mobile-stage-y", `${mobileShift}px`);
      root.current?.style.setProperty("--scroll-progress", String(phase));
      setRenderPaused(document.hidden || phase > 3.5);
      if (isMobile && y >= insideTop - 300 && y < insideTop - 100) {
        root.current?.style.setProperty(
          "--scene-opacity",
          String((y - insideTop + 300) / 200),
        );
      } else root.current?.style.setProperty("--scene-opacity", "1");
      frame = 0;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    document.addEventListener("visibilitychange", scroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      document.removeEventListener("visibilitychange", scroll);
    };
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!ready) onFail();
    }, 18000);
    return () => window.clearTimeout(timeout);
  }, [ready, onFail]);
  useEffect(
    () => () => {
      timeline.current?.kill();
      void audio.current?.close();
    },
    [],
  );

  const playSound = useCallback(() => {
    if (!audio.current) return;
    const context = audio.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      60,
      context.currentTime + 0.35,
    );
    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.45);
  }, []);

  const selectFlavor = useCallback(
    (index: number) => {
      if (index === selected) return;
      setSelected(index);
      if (sound) playSound();
      timeline.current?.kill();
      if (reducedMotion || failed) {
        setActive(index);
        scene.current.transition = 0;
        scene.current.spin = 0;
        return;
      }
      const startSpin = scene.current.spin;
      timeline.current = gsap
        .timeline({
          onUpdate: () => window.dispatchEvent(new Event("volt-frame")),
        })
        .to(scene.current, {
          transition: 1,
          spin: startSpin + Math.PI,
          duration: TRANSITION_DURATION * 0.4,
          ease: "power2.in",
        })
        .call(() => setActive(index))
        .to(scene.current, {
          transition: 0,
          spin: startSpin + Math.PI * 2,
          rotation: 0,
          duration: TRANSITION_DURATION * 0.6,
          ease: "power3.out",
        });
    },
    [selected, sound, reducedMotion, failed, playSound],
  );

  const toggleSound = () => {
    if (!sound) {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      playSound();
    }
    setSound(!sound);
  };

  return (
    <div
      ref={root}
      className={`energy-site ${failed ? "webgl-fallback" : ""} ${paused || reducedMotion ? "motion-paused" : ""}`}
      style={
        {
          "--accent": flavor.color,
          "--secondary": flavor.secondary,
          "--tint": flavor.tint,
        } as CSSProperties
      }
    >
      <a href="#experience" className="skip-link">
        Skip to flavor details
      </a>
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere-glow" />
        <div className="light-beam beam-one" />
        <div className="light-beam beam-two" />
        <div className="grain" />
      </div>
      <div
        className="scene-container"
        aria-label={`Interactive 3D ${flavor.name} energy drink can`}
        role="img"
      >
        {!failed && (
          <Experience
            flavor={flavor}
            motion={scene}
            onReady={onReady}
            onFail={onFail}
            paused={renderPaused}
            still={paused || reducedMotion}
          />
        )}
        {failed && (
          <div className="fallback-art">
            <span className="fallback-bolt">ϟ</span>
            <strong>VOLT</strong>
            <span>{flavor.label}</span>
            <p>Lightweight experience · 3D unavailable</p>
          </div>
        )}
      </div>
      <Navbar sound={sound} onSound={toggleSound} />
      <main>
        <Hero
          flavor={flavor}
          active={active}
          paused={paused}
          onPause={() => setPaused(!paused)}
          onRotate={(direction) => {
            scene.current.rotation += (direction * Math.PI) / 4;
            window.dispatchEvent(new Event("volt-frame"));
          }}
          reducedMotion={reducedMotion}
        />
        <FlavorSelector active={selected} onSelect={selectFlavor} />
        <FlavorExperience
          flavor={flavor}
          active={active}
          reducedMotion={reducedMotion}
        />
        <About active={selected} onSelect={selectFlavor} />
      </main>
      <span className="sr-only" aria-live="polite">
        Selected flavor: {flavor.name}. {flavor.taste}
      </span>
      <CustomCursor reducedMotion={reducedMotion} />
      <Loader ready={ready} />
    </div>
  );
}
