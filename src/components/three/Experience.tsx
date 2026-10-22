"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Flavor } from "@/data/flavors";
import type { SceneMotion } from "@/lib/scene";
import EnergyCan from "./EnergyCan";
import Particles from "./Particles";
import Lighting from "./Lighting";

class SceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Ready({ onReady }: { onReady: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    onReady();
    const contextLost = (event: Event) => {
      event.preventDefault();
      window.dispatchEvent(new Event("volt-context-lost"));
    };
    gl.domElement.addEventListener("webglcontextlost", contextLost);
    return () =>
      gl.domElement.removeEventListener("webglcontextlost", contextLost);
  }, [onReady, gl]);
  return null;
}

type Props = {
  flavor: Flavor;
  motion: React.RefObject<SceneMotion>;
  onReady: () => void;
  onFail: () => void;
  paused: boolean;
  still: boolean;
};

export default function Experience({
  flavor,
  motion,
  onReady,
  onFail,
  paused,
  still,
}: Props) {
  const [mobile, setMobile] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    let cancelled = false;
    Promise.all([
      document.fonts.load('800 32px "Barlow Condensed"'),
      document.fonts.load('500 16px "DM Sans"'),
    ]).then(() => {
      if (!cancelled) setFontsReady(true);
    });
    window.addEventListener("volt-context-lost", onFail);
    return () => {
      cancelled = true;
      media.removeEventListener("change", update);
      window.removeEventListener("volt-context-lost", onFail);
    };
  }, [onFail]);

  if (!fontsReady) return null;
  return (
    <SceneBoundary onFail={onFail}>
      <Canvas
        camera={{
          position: [0, 0, 10.8],
          fov: mobile ? 40 : 36,
          near: 0.1,
          far: 50,
        }}
        dpr={mobile ? [1, 1.35] : [1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={paused || still ? "demand" : "always"}
        fallback={
          <span>
            Your browser does not support WebGL. Flavor details are available
            below.
          </span>
        }
      >
        <Suspense fallback={null}>
          <Lighting flavor={flavor} />
          <Particles flavor={flavor} motion={motion} mobile={mobile} />
          <EnergyCan flavor={flavor} motion={motion} mobile={mobile} />
          <AdaptiveDpr pixelated />
          <Ready onReady={onReady} />
          <FrameScheduler still={still} paused={paused} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}

/** In demand mode, redraw only while an interaction is settling. */
function FrameScheduler({
  still,
  paused,
}: {
  still: boolean;
  paused: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const settleUntil = useRef(0);
  useEffect(() => {
    const wake = () => {
      if (paused || !still) return;
      settleUntil.current = performance.now() + 900;
      invalidate();
    };
    wake();
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("volt-frame", wake);
    return () => {
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("volt-frame", wake);
    };
  }, [still, paused, invalidate]);
  useFrame(() => {
    if (still && !paused && performance.now() < settleUntil.current)
      invalidate();
  });
  return null;
}
