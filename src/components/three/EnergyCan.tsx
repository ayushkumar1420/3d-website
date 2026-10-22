"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Flavor } from "@/data/flavors";
import { createCanTexture } from "@/lib/can-texture";
import { smoothstep, type SceneMotion } from "@/lib/scene";

const BODY_HEIGHT = 3.42;

type Props = {
  flavor: Flavor;
  motion: React.RefObject<SceneMotion>;
  mobile: boolean;
};

export default function EnergyCan({ flavor, motion, mobile }: Props) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const base = useRef<THREE.Group>(null);
  const sleeve = useRef<THREE.Mesh>(null);
  const droplets = useRef<THREE.InstancedMesh>(null);
  const interaction = useRef({
    x: 0,
    rotation: 0,
    startRotation: 0,
    dragging: false,
  });
  const texture = useMemo(() => createCanTexture(flavor), [flavor]);
  const shape = useMemo(
    () => [
      new THREE.Vector2(0, -1.97),
      new THREE.Vector2(0.74, -1.97),
      new THREE.Vector2(0.82, -1.91),
      new THREE.Vector2(0.85, -1.81),
      new THREE.Vector2(0.91, -1.68),
      new THREE.Vector2(0.91, 1.68),
      new THREE.Vector2(0.87, 1.8),
      new THREE.Vector2(0.79, 1.94),
      new THREE.Vector2(0.79, 2.0),
    ],
    [],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    if (!droplets.current) return;
    const dummy = new THREE.Object3D();
    let seed = 23;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < (mobile ? 65 : 150); i++) {
      const angle = random() * Math.PI * 2;
      const size = 0.008 + random() ** 3 * 0.025;
      dummy.position.set(
        Math.sin(angle) * 0.923,
        (random() - 0.5) * 3.25,
        Math.cos(angle) * 0.923,
      );
      dummy.scale.set(size, size * 1.2, size * 0.55);
      dummy.rotation.set(0, angle, 0);
      dummy.updateMatrix();
      droplets.current.setMatrixAt(i, dummy.matrix);
    }
    droplets.current.instanceMatrix.needsUpdate = true;
  }, [mobile]);

  useFrame((state, rawDelta) => {
    if (!root.current || !lid.current || !base.current || !sleeve.current)
      return;
    const delta = Math.min(rawDelta, 0.05);
    const m = motion.current;
    const story = smoothstep(0.15, 0.8, m.scroll);
    const explode =
      smoothstep(1.8, 2.12, m.scroll) * (1 - smoothstep(2.3, 2.6, m.scroll));
    const exit = smoothstep(2.45, 2.85, m.scroll);
    const time = m.paused || m.reducedMotion ? 0 : state.clock.elapsedTime;
    const targetX = mobile ? -0.42 : THREE.MathUtils.lerp(1.28, -2.55, story);
    const targetScale = mobile ? 0.62 : THREE.MathUtils.lerp(1.06, 0.94, story);
    root.current.position.x = THREE.MathUtils.damp(
      root.current.position.x,
      targetX,
      4,
      delta,
    );
    root.current.position.y = THREE.MathUtils.damp(
      root.current.position.y,
      (mobile ? 0.15 : 0.04) + Math.sin(time * 0.85) * 0.065 + exit * 7,
      4,
      delta,
    );
    root.current.position.z = -m.transition * 4;
    root.current.scale.setScalar(targetScale * (1 - m.transition * 0.28));
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      0.075 + (m.reducedMotion ? 0 : state.pointer.y * 0.045),
      3,
      delta,
    );
    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      THREE.MathUtils.lerp(-0.19, 0.06, story) + Math.sin(time * 0.6) * 0.015,
      3,
      delta,
    );
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      Math.PI +
        m.rotation +
        interaction.current.rotation +
        m.spin +
        Math.sin(time * 0.35) * 0.08 +
        (m.reducedMotion ? 0 : state.pointer.x * 0.09),
      6,
      delta,
    );
    lid.current.position.y = THREE.MathUtils.damp(
      lid.current.position.y,
      explode * 0.9,
      5,
      delta,
    );
    base.current.position.y = THREE.MathUtils.damp(
      base.current.position.y,
      -explode * 0.35,
      5,
      delta,
    );
    sleeve.current.scale.setScalar(1 + explode * 0.085);
    (sleeve.current.material as THREE.MeshPhysicalMaterial).opacity =
      1 - explode * 0.22;
  });

  const down = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    interaction.current.dragging = true;
    interaction.current.x = event.clientX;
    interaction.current.startRotation = interaction.current.rotation;
    (event.target as unknown as HTMLElement).setPointerCapture(event.pointerId);
    document.body.dataset.cursor = "DRAG";
  };
  const move = (event: ThreeEvent<PointerEvent>) => {
    if (interaction.current.dragging)
      interaction.current.rotation =
        interaction.current.startRotation +
        (event.clientX - interaction.current.x) * 0.009;
  };
  const up = (event: ThreeEvent<PointerEvent>) => {
    interaction.current.dragging = false;
    (event.target as unknown as HTMLElement).releasePointerCapture?.(
      event.pointerId,
    );
  };

  return (
    <group
      ref={root}
      position={[mobile ? -0.42 : 1.28, 0, 0]}
      rotation={[0.075, Math.PI, -0.19]}
    >
      <group
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerOver={() => {
          document.body.dataset.cursor = "DRAG";
        }}
        onPointerOut={() => {
          if (!interaction.current.dragging) document.body.dataset.cursor = "";
        }}
      >
        <mesh>
          <latheGeometry args={[shape, mobile ? 64 : 96]} />
          <meshStandardMaterial
            color="#858c84"
            metalness={0.95}
            roughness={0.25}
          />
        </mesh>
        <mesh ref={sleeve}>
          <cylinderGeometry
            args={[0.914, 0.914, BODY_HEIGHT, mobile ? 64 : 96, 1, true]}
          />
          <meshPhysicalMaterial
            map={texture}
            metalness={0.56}
            roughness={0.3}
            clearcoat={0.65}
            clearcoatRoughness={0.2}
            transparent
          />
        </mesh>
        <group ref={lid}>
          <mesh position={[0, 1.98, 0]}>
            <cylinderGeometry args={[0.797, 0.8, 0.075, 80]} />
            <meshStandardMaterial
              color="#c5cbc4"
              metalness={1}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[0, 2.027, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.772, 0.032, 10, 80]} />
            <meshStandardMaterial
              color="#e1e6df"
              metalness={1}
              roughness={0.16}
            />
          </mesh>
          <mesh position={[0, 2.021, 0]}>
            <cylinderGeometry args={[0.706, 0.706, 0.01, 80]} />
            <meshStandardMaterial
              color="#939b92"
              metalness={1}
              roughness={0.28}
            />
          </mesh>
          <mesh
            position={[0, 2.03, -0.32]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[0.65, 1, 1]}
          >
            <circleGeometry args={[0.27, 32]} />
            <meshStandardMaterial
              color="#252b23"
              metalness={0.75}
              roughness={0.4}
            />
          </mesh>
          <group position={[0, 2.052, 0.07]} rotation={[0, 0.15, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.68, 1.25, 1]}>
              <torusGeometry args={[0.2, 0.063, 8, 32]} />
              <meshStandardMaterial
                color="#d9dfd5"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.004, -0.12]}>
              <cylinderGeometry args={[0.07, 0.07, 0.035, 24]} />
              <meshStandardMaterial
                color="#cdd3c7"
                metalness={1}
                roughness={0.25}
              />
            </mesh>
          </group>
        </group>
        <group ref={base}>
          <mesh position={[0, -1.935, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.784, 0.035, 10, 80]} />
            <meshStandardMaterial
              color="#b7c0b0"
              metalness={1}
              roughness={0.22}
            />
          </mesh>
        </group>
        <instancedMesh
          ref={droplets}
          args={[undefined, undefined, mobile ? 65 : 150]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 7, 5]} />
          <meshPhysicalMaterial
            color="#7d8d77"
            metalness={0.2}
            roughness={0.08}
            transparent
            opacity={0.5}
            clearcoat={1}
          />
        </instancedMesh>
      </group>
    </group>
  );
}

