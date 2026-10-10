"use client";

import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_POSITIONS: [number, number, number][] = [
  [1.82, 0.74, 0.12],
  [-1.72, 0.98, -0.2],
  [1.46, -1.12, 0.3],
  [-1.5, -1.22, 0.4],
  [0.28, 1.78, -0.42],
  [-0.22, -1.82, -0.22],
  [2.08, -0.12, -0.5],
  [-2.02, 0.08, 0.08],
  [1.08, 1.5, 0.58],
  [-1.08, 1.46, 0.48],
  [0.96, -1.58, -0.58],
  [-0.96, -1.5, 0.62],
];

const INNER_LINKS: [number, number][] = [
  [0, 4], [0, 6], [0, 8], [0, 2], [1, 4], [1, 7], [1, 9], [1, 3],
  [2, 5], [2, 6], [2, 10], [3, 5], [3, 7], [3, 11], [4, 8], [4, 9],
  [5, 10], [5, 11], [6, 8], [6, 10], [7, 9], [7, 11],
];

function makeSegments(pairs: Array<[[number, number, number], [number, number, number]]>) {
  const positions = new Float32Array(pairs.length * 6);
  let offset = 0;
  for (const [a, b] of pairs) {
    positions.set(a, offset);
    positions.set(b, offset + 3);
    offset += 6;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function NetworkCore() {
  const root = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  const radialGeometry = useMemo(
    () => makeSegments(NODE_POSITIONS.map(position => [[0, 0, 0], position])),
    [],
  );
  const innerGeometry = useMemo(
    () => makeSegments(INNER_LINKS.map(([a, b]) => [NODE_POSITIONS[a], NODE_POSITIONS[b]])),
    [],
  );

  useFrame((state, delta) => {
    if (!root.current || !rings.current || !core.current) return;

    const pointerX = state.pointer.x * 0.2;
    const pointerY = state.pointer.y * 0.13;

    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, pointerY, 3.2, delta);
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointerX + state.clock.elapsedTime * 0.055,
      3.2,
      delta,
    );

    rings.current.rotation.z += delta * 0.052;
    rings.current.rotation.y -= delta * 0.028;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.1) * 0.035;
    core.current.scale.setScalar(pulse);
  });

  return (
    <group ref={root}>
      <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.28}>
        <mesh>
          <icosahedronGeometry args={[1.03, 2]} />
          <meshStandardMaterial
            color="#6f91ff"
            emissive="#315fff"
            emissiveIntensity={0.8}
            metalness={0.58}
            roughness={0.18}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh scale={0.74}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#173a9e"
            emissive="#214fd6"
            emissiveIntensity={0.65}
            metalness={0.42}
            roughness={0.24}
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh ref={core} scale={0.23}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#eef3ff" toneMapped={false} />
        </mesh>
      </Float>

      <group ref={rings}>
        <mesh rotation={[Math.PI / 2.2, 0.2, 0.12]}>
          <torusGeometry args={[1.52, 0.008, 6, 112]} />
          <meshBasicMaterial color="#7096ff" transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[0.42, Math.PI / 2.55, -0.26]}>
          <torusGeometry args={[1.78, 0.007, 6, 128]} />
          <meshBasicMaterial color="#a8b9ff" transparent opacity={0.34} />
        </mesh>
        <mesh rotation={[-0.68, 0.52, 0.36]}>
          <torusGeometry args={[1.98, 0.0055, 6, 128]} />
          <meshBasicMaterial color="#416eff" transparent opacity={0.28} />
        </mesh>
      </group>

      <lineSegments geometry={radialGeometry}>
        <lineBasicMaterial color="#5f84f1" transparent opacity={0.22} />
      </lineSegments>
      <lineSegments geometry={innerGeometry}>
        <lineBasicMaterial color="#496ed1" transparent opacity={0.16} />
      </lineSegments>

      {NODE_POSITIONS.map((position, index) => (
        <mesh position={position} key={`node-${index}`}>
          <sphereGeometry args={[index % 4 === 0 ? 0.075 : 0.055, 12, 12]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? "#eef3ff" : "#7096ff"}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene3D({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.7], fov: 38, near: 0.1, far: 30 }}
      dpr={[1, 1.35]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.6, max: 1 }}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[3.4, 4.5, 5]} intensity={1.4} color="#c5d1ff" />
      <pointLight position={[-3.2, -2, 3]} intensity={10} distance={8} color="#315fff" />
      <pointLight position={[3.5, 1.5, 1]} intensity={6} distance={7} color="#557cff" />

      <NetworkCore />

      <Sparkles
        count={34}
        scale={[5.4, 4.6, 3.8]}
        size={1.65}
        speed={0.16}
        opacity={0.34}
        color="#92aaff"
      />
    </Canvas>
  );
}
