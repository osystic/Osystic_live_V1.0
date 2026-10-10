"use client";

import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function fibonacciSphere(count: number, radius: number) {
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    return new THREE.Vector3(
      Math.cos(theta) * radial * radius,
      y * radius,
      Math.sin(theta) * radial * radius,
    );
  });
}

function TrustNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const nodes = useMemo(() => fibonacciSphere(28, 1.62), []);
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let a = 0; a < nodes.length; a += 1) {
      const candidates = nodes
        .map((point, b) => ({ b, distance: a === b ? Infinity : nodes[a].distanceTo(point) }))
        .sort((x, y) => x.distance - y.distance)
        .slice(0, 3);

      for (const { b } of candidates) {
        if (a >= b) continue;
        positions.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [nodes]);

  useEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    nodes.forEach((position, index) => {
      const scale = index % 7 === 0 ? 1.45 : index % 3 === 0 ? 1.12 : 0.86;
      matrix.compose(position, new THREE.Quaternion(), new THREE.Vector3(scale, scale, scale));
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const rings = ringRef.current;
    if (!group || !rings) return;

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, state.pointer.y * 0.15, 3.2, delta);
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      state.pointer.x * 0.22 + state.clock.elapsedTime * 0.055,
      3.2,
      delta,
    );
    rings.rotation.z += delta * 0.055;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial color="#5e7fff" wireframe transparent opacity={0.68} />
      </mesh>

      <mesh scale={0.39}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#3150a8" wireframe transparent opacity={0.52} />
      </mesh>

      <mesh scale={0.18}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#071226" transparent opacity={0.9} />
      </mesh>

      <mesh scale={0.075}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color="#91adff" transparent opacity={0.78} toneMapped={false} />
      </mesh>

      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#7896ff" transparent opacity={0.23} />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#a9bbef" transparent opacity={0.86} toneMapped={false} />
      </instancedMesh>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2.3, 0.2, 0.18]}>
          <torusGeometry args={[2.02, 0.006, 6, 96]} />
          <meshBasicMaterial color="#6987ff" transparent opacity={0.32} />
        </mesh>
        <mesh rotation={[0.42, Math.PI / 2.7, -0.24]}>
          <torusGeometry args={[2.22, 0.006, 6, 96]} />
          <meshBasicMaterial color="#77c7ff" transparent opacity={0.18} />
        </mesh>
        <mesh rotation={[-0.24, 0.9, Math.PI / 2.2]}>
          <torusGeometry args={[1.84, 0.004, 6, 80]} />
          <meshBasicMaterial color="#a5b7ff" transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
}

export default function AboutNetwork3D({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 5.65], fov: 38, near: 0.1, far: 30 }}
      dpr={[1, 1.35]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <TrustNetwork />
      <Sparkles count={22} scale={[5.4, 4.6, 3.8]} size={1.25} speed={0.14} opacity={0.22} color="#8fa7ff" />
    </Canvas>
  );
}
