"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Building = { side: -1 | 1; z: number; height: number; depth: number; width: number; color: string };

function BuildingFacade({ building, index }: { building: Building; index: number }) {
  const face = building.side === -1 ? 1 : -1;
  const neon = index % 3 === 0 ? "#bb52ff" : "#00d9ff";
  const windows = Array.from({ length: Math.max(4, Math.floor(building.height * 1.35)) });
  return <group position={[building.side * (3.25 + building.depth / 2), building.height / 2 - 2.65, building.z]}>
    <mesh><boxGeometry args={[building.depth, building.height, building.width]} /><meshStandardMaterial color={building.color} metalness={.8} roughness={.35} /></mesh>
    <mesh rotation={[0, face * Math.PI / 2, 0]} position={[face * building.depth / 2 + face * .012, 0, 0]}>
      <planeGeometry args={[building.width * .88, building.height * .9]} /><meshBasicMaterial color="#061a25" />
    </mesh>
    {windows.map((_, windowIndex) => <mesh key={windowIndex} rotation={[0, face * Math.PI / 2, 0]} position={[face * building.depth / 2 + face * .024, -building.height * .31 + windowIndex * .47, (windowIndex % 2 ? -.22 : .22) * building.width]}>
      <planeGeometry args={[.2, .2]} /><meshBasicMaterial color={windowIndex % 5 === 0 ? "#d967ff" : "#2beeff"} transparent opacity={.55 + (windowIndex % 3) * .12} />
    </mesh>)}
    {index % 2 === 0 && <group position={[face * (building.depth / 2 + .045), .35, 0]} rotation={[0, face * Math.PI / 2, 0]}>
      <mesh><planeGeometry args={[building.width * .58, .45]} /><meshBasicMaterial color={neon} transparent opacity={.85} /></mesh>
      <mesh position={[0, 0, .01]}><planeGeometry args={[building.width * .38, .045]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>}
  </group>;
}

function CityStreet() {
  const buildings = useMemo<Building[]>(() => Array.from({ length: 22 }, (_, index) => {
    const side: -1 | 1 = index % 2 ? 1 : -1;
    return { side, z: -3 - Math.floor(index / 2) * 2.55, height: 3.2 + (index * 7 % 11) * .48, depth: 1.1 + (index % 3) * .18, width: 1.65 + (index % 4) * .23, color: index % 4 === 0 ? "#16062e" : "#061820" };
  }), []);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.68, -15]}><planeGeometry args={[5.6, 48]} /><meshStandardMaterial color="#06131c" metalness={.9} roughness={.28} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.665, -15]}><planeGeometry args={[.055, 48]} /><meshBasicMaterial color="#00d9ff" transparent opacity={.8} /></mesh>
    {[-2.95, 2.95].map(x => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.65, -15]}><planeGeometry args={[.6, 48]} /><meshStandardMaterial color="#10121c" metalness={.7} /></mesh>)}
    {buildings.map((building, index) => <BuildingFacade key={index} building={building} index={index} />)}
  </group>;
}

function HoverTraffic() {
  const traffic = useRef<THREE.Group>(null);
  useFrame((state) => traffic.current?.children.forEach((car, index) => {
    car.position.z = -2 - ((state.clock.elapsedTime * (4.2 + index % 3) + index * 7) % 37);
    car.position.y = -1.65 + Math.sin(state.clock.elapsedTime * 2 + index) * .045;
  }));
  return <group ref={traffic}>
    {Array.from({ length: 10 }, (_, index) => <group key={index} position={[index % 2 ? -1.08 : 1.08, -1.65, -4 - index * 3.2]}>
      <mesh><boxGeometry args={[.42, .12, .78]} /><meshStandardMaterial color="#07101b" emissive={index % 3 ? "#00b8d4" : "#8626d8"} emissiveIntensity={2.3} metalness={.95} /></mesh>
      <mesh position={[0, 0, .42]}><boxGeometry args={[.32, .04, .04]} /><meshBasicMaterial color="#dcfbff" /></mesh>
      <pointLight color={index % 3 ? "#00d9ff" : "#b454ff"} intensity={3.5} distance={2.2} />
    </group>)}
  </group>;
}

function StreetLamps() {
  return <group>{Array.from({ length: 16 }, (_, index) => {
    const side = index % 2 ? -1 : 1;
    return <group key={index} position={[side * 2.7, -2.55, -3 - Math.floor(index / 2) * 3.3]}>
      <mesh position={[0, .95, 0]}><cylinderGeometry args={[.025, .035, 1.9, 6]} /><meshStandardMaterial color="#1a3440" metalness={.9} /></mesh>
      <mesh position={[-side * .24, 1.84, 0]}><boxGeometry args={[.5, .025, .025]} /><meshBasicMaterial color="#2a677d" /></mesh>
      <pointLight color="#4beeff" intensity={4} distance={3} position={[-side * .48, 1.78, 0]} />
    </group>;
  })}</group>;
}

function Rain() {
  const rain = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(3200 * 3);
    for (let index = 0; index < values.length; index += 3) { values[index] = (Math.random() - .5) * 16; values[index + 1] = Math.random() * 13 - 3; values[index + 2] = -Math.random() * 40; }
    return values;
  }, []);
  useFrame((state) => { if (rain.current) rain.current.position.y = -((state.clock.elapsedTime * 1.25) % 1.8); });
  return <points ref={rain}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#b6f7ff" size={.027} transparent opacity={.72} sizeAttenuation /></points>;
}

function CameraDrift() {
  const { camera, pointer } = useThree();
  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * .42, .022);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, .5 + pointer.y * .18, .022);
    camera.position.z = 8 + Math.sin(state.clock.elapsedTime * .16) * .13;
    camera.lookAt(0, -.15, -12);
  });
  return null;
}

function World() {
  return <><ambientLight intensity={.22} /><hemisphereLight color="#55eaff" groundColor="#010105" intensity={.42} /><pointLight color="#00d9ff" intensity={16} position={[0, 3, 2]} distance={17} /><pointLight color="#8d35e8" intensity={16} position={[-5, 3, -9]} distance={14} /><Rain /><StreetLamps /><HoverTraffic /><CityStreet /><CameraDrift /></>;
}

export default function CyberScene() {
  return <div className="scene" aria-hidden="true"><Canvas camera={{ position: [0, .5, 8], fov: 62 }} dpr={[1, 1.5]}><color attach="background" args={["#02050a"]} /><fog attach="fog" args={["#02050a", 7, 30]} /><World /></Canvas></div>;
}
