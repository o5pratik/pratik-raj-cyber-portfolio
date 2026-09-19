"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function City() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => { if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * .08) * .1; });
  return <group ref={group} position={[0, -2, -5]}>
    {Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      const radius = 5 + (i % 4) * 1.6;
      const h = 1.2 + (i % 7) * .55;
      return <mesh key={i} position={[Math.cos(angle) * radius, h / 2 - 1, Math.sin(angle) * radius]}>
        <boxGeometry args={[.45 + (i % 3) * .22, h, .45 + (i % 2) * .3]} />
        <meshStandardMaterial color={i % 5 === 0 ? "#7c3aed" : "#00d9ff"} emissive={i % 5 === 0 ? "#23084b" : "#003f4a"} metalness={.9} roughness={.35} />
      </mesh>;
    })}
  </group>;
}
function Core() {
  const core = useRef<THREE.Mesh>(null);
  useFrame((state) => { if (core.current) { core.current.rotation.x = state.clock.elapsedTime * .18; core.current.rotation.y = state.clock.elapsedTime * .3; core.current.position.y = .25 + Math.sin(state.clock.elapsedTime * 1.7) * .22; } });
  return <mesh ref={core} position={[0, .25, -1]}><icosahedronGeometry args={[1.1, 1]} /><meshStandardMaterial color="#081a25" emissive="#006e87" emissiveIntensity={2} wireframe /></mesh>;
}
function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = new Float32Array(900 * 3);
  for (let i = 0; i < positions.length; i += 3) { positions[i] = (Math.random() - .5) * 32; positions[i + 1] = (Math.random() - .5) * 20; positions[i + 2] = -Math.random() * 30; }
  useFrame((state) => { if (points.current) points.current.rotation.y = state.clock.elapsedTime * .008; });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#77eaff" size={.035} sizeAttenuation transparent opacity={.8} /></points>;
}
export default function CyberScene() {
  return <div className="scene" aria-hidden="true"><Canvas camera={{ position: [0, 1.2, 12], fov: 52 }} dpr={[1, 1.5]}>
    <color attach="background" args={["#050505"]} /><fog attach="fog" args={["#050505", 7, 25]} />
    <ambientLight intensity={.2} /><pointLight color="#00d9ff" intensity={18} position={[0, 3, 3]} distance={13} /><pointLight color="#7c3aed" intensity={12} position={[-5, 0, -2]} distance={10} />
    <Particles /><Core /><City />
  </Canvas></div>;
}
