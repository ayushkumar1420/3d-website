"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, PointLight } from "three";
import type { Flavor } from "@/data/flavors";

export default function Lighting({ flavor }: { flavor: Flavor }) {
  const rim = useRef<PointLight>(null);
  const color = useMemo(() => new Color(flavor.color), [flavor.color]);
  useFrame((_, delta) => {
    rim.current?.color.lerp(color, Math.min(1, delta * 3));
  });
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[-4, 5, 6]} intensity={3.4} color="#eff5e6" />
      <directionalLight position={[3, 1, 4]} intensity={1.3} color="#e7efd9" />
      <pointLight
        ref={rim}
        position={[3, 2, -2]}
        intensity={26}
        color={flavor.color}
        distance={14}
      />
      <pointLight
        position={[-4, -2, 1]}
        intensity={10}
        color={flavor.secondary}
        distance={12}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer
          position={[-4, 2, 3]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[3, 10, 1]}
          intensity={3}
          color="#ffffff"
        />
        <Lightformer
          position={[4, 3, 1]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[2, 8, 1]}
          intensity={2}
          color="#e4efd6"
        />
        <Lightformer
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 3, 1]}
          intensity={3}
        />
      </Environment>
    </>
  );
}
