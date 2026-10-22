"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Flavor } from "@/data/flavors";
import type { SceneMotion } from "@/lib/scene";

type Props = {
  flavor: Flavor;
  motion: React.RefObject<SceneMotion>;
  mobile: boolean;
};

export default function Particles({ flavor, motion, mobile }: Props) {
  const points = useRef<THREE.Points>(null);
  const shards = useRef<THREE.Group>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const color = useMemo(() => new THREE.Color(flavor.color), [flavor.color]);
  const positions = useMemo(() => {
    const count = mobile ? 65 : 180;
    const data = new Float32Array(count * 3);
    let seed = 125;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      data[i * 3] = (random() - 0.5) * 18;
      data[i * 3 + 1] = (random() - 0.5) * 13;
      data[i * 3 + 2] = -2 - random() * 5;
    }
    return data;
  }, [mobile]);

  useFrame((state, delta) => {
    if (!points.current || !material.current || !shards.current) return;
    material.current.color.lerp(color, Math.min(1, delta * 3));
    if (motion.current.paused || motion.current.reducedMotion) return;
    points.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.035) * 0.12;
    points.current.position.x = THREE.MathUtils.damp(
      points.current.position.x,
      state.pointer.x * -0.2,
      2,
      delta,
    );
    shards.current.rotation.y = state.clock.elapsedTime * 0.035;
    shards.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.18;
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          color={flavor.color}
          size={flavor.id === "blue" ? 0.045 : 0.025}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <group ref={shards}>
        {Array.from({ length: mobile ? 4 : 9 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 2.4) * 4.5,
              Math.cos(i * 3.1) * 2.9,
              -2.5 - (i % 3),
            ]}
            rotation={[i, i * 0.7, i * 1.2]}
            scale={
              flavor.id === "watermelon"
                ? [0.06, 0.18, 0.05]
                : [0.12, 0.12, 0.12]
            }
          >
            {flavor.id === "blue" ? (
              <octahedronGeometry />
            ) : flavor.id === "mango" ? (
              <tetrahedronGeometry />
            ) : flavor.id === "original" ? (
              <boxGeometry args={[0.3, 2.6, 0.3]} />
            ) : (
              <sphereGeometry args={[1, 12, 8]} />
            )}
            <meshStandardMaterial
              color={flavor.color}
              emissive={flavor.color}
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.2}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
