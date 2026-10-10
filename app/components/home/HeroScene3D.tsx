"use client";

import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_POSITIONS: [number, number, number][] = [
  [1.82, 0.74, 0.12],[-1.72, 0.98, -0.2],[1.46, -1.12, 0.3],[-1.5, -1.22, 0.4],
  [0.28, 1.78, -0.42],[-0.22, -1.82, -0.22],[2.08, -0.12, -0.5],[-2.02, 0.08, 0.08],
  [1.08, 1.5, 0.58],[-1.08, 1.46, 0.48],[0.96, -1.58, -0.58],[-0.96, -1.5, 0.62],
];

const LINKS: [number, number][] = [
  [0,4],[0,6],[0,8],[0,2],[1,4],[1,7],[1,9],[1,3],[2,5],[2,6],[2,10],
  [3,5],[3,7],[3,11],[4,8],[4,9],[5,10],[5,11],[6,8],[6,10],[7,9],[7,11],
];

function segments(pairs:Array<[[number,number,number],[number,number,number]]>) {
  const positions = new Float32Array(pairs.length * 6);
  pairs.forEach(([a,b],index)=>{ positions.set(a,index*6); positions.set(b,index*6+3); });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
  return geometry;
}

function NetworkCore(){
  const root=useRef<THREE.Group>(null);
  const shell=useRef<THREE.Mesh>(null);
  const rings=useRef<THREE.Group>(null);
  const radial=useMemo(()=>segments(NODE_POSITIONS.map(p=>[[0,0,0],p])),[]);
  const meshLinks=useMemo(()=>segments(LINKS.map(([a,b])=>[NODE_POSITIONS[a],NODE_POSITIONS[b]])),[]);

  useFrame((state,delta)=>{
    if(!root.current||!shell.current||!rings.current) return;
    root.current.rotation.x=THREE.MathUtils.damp(root.current.rotation.x,state.pointer.y*.09,3,delta);
    root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,state.pointer.x*.14+state.clock.elapsedTime*.035,3,delta);
    rings.current.rotation.z+=delta*.028;
    rings.current.rotation.y-=delta*.018;
    const pulse=1+Math.sin(state.clock.elapsedTime*1.6)*.018;
    shell.current.scale.setScalar(pulse);
  });

  return <group ref={root}>
    <Float speed={.8} rotationIntensity={.08} floatIntensity={.18}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.05,2]}/>
        <meshBasicMaterial color="#6f8fff" wireframe transparent opacity={.58}/>
      </mesh>

      <mesh scale={.82}>
        <icosahedronGeometry args={[1,1]}/>
        <meshBasicMaterial color="#3158c9" wireframe transparent opacity={.22}/>
      </mesh>

      <mesh scale={.56}>
        <sphereGeometry args={[1,32,32]}/>
        <meshBasicMaterial color="#081329" transparent opacity={.78} depthWrite={false}/>
      </mesh>

      <mesh scale={.18}>
        <sphereGeometry args={[1,20,20]}/>
        <meshBasicMaterial color="#5f84ff" transparent opacity={.32} toneMapped={false}/>
      </mesh>

      <mesh scale={.07}>
        <sphereGeometry args={[1,18,18]}/>
        <meshBasicMaterial color="#dce6ff" toneMapped={false}/>
      </mesh>
    </Float>

    <group ref={rings}>
      <mesh rotation={[Math.PI/2.2,.2,.12]}>
        <torusGeometry args={[1.52,.006,6,112]}/>
        <meshBasicMaterial color="#6488ff" transparent opacity={.44}/>
      </mesh>
      <mesh rotation={[.42,Math.PI/2.55,-.26]}>
        <torusGeometry args={[1.78,.005,6,128]}/>
        <meshBasicMaterial color="#7d98ff" transparent opacity={.2}/>
      </mesh>
      <mesh rotation={[-.68,.52,.36]}>
        <torusGeometry args={[1.98,.004,6,128]}/>
        <meshBasicMaterial color="#355dcb" transparent opacity={.16}/>
      </mesh>
    </group>

    <lineSegments geometry={radial}><lineBasicMaterial color="#5878d8" transparent opacity={.15}/></lineSegments>
    <lineSegments geometry={meshLinks}><lineBasicMaterial color="#3f5fae" transparent opacity={.13}/></lineSegments>

    {NODE_POSITIONS.map((position,index)=><mesh position={position} key={index}>
      <sphereGeometry args={[index%4===0?.07:.05,12,12]}/>
      <meshBasicMaterial color={index%3===0?"#c8d6ff":"#6285ff"} transparent opacity={index%3===0?.88:.74} toneMapped={false}/>
    </mesh>)}
  </group>;
}

export default function HeroScene3D({active=true}:{active?:boolean}){
  return <Canvas
    camera={{position:[0,0,5.8],fov:38,near:.1,far:30}}
    dpr={[1,1.35]}
    frameloop={active?"always":"never"}
    gl={{antialias:false,alpha:true,powerPreference:"high-performance"}}
    performance={{min:.6,max:1}}
  >
    <NetworkCore/>
    <Sparkles count={26} scale={[5.2,4.4,3.6]} size={1.25} speed={.12} opacity={.22} color="#7f9cff"/>
  </Canvas>;
}
