"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CyberCity() {
  const city = useRef<THREE.Group>(null);
  const buildings = useMemo(() => Array.from({ length: 94 }, (_, index) => {
    const row = Math.floor(index / 16);
    return {
      x: ((index % 16) - 7.5) * 1.25 + (row % 2) * .25,
      z: -row * 2.1 - 2.5,
      height: 1.7 + ((index * 13) % 11) * .48,
      width: .55 + (index % 3) * .18,
      violet: index % 7 === 0,
    };
  }), []);

  useFrame((state) => {
    if (city.current) city.current.position.x = Math.sin(state.clock.elapsedTime * .12) * .24;
  });

  return <group ref={city} position={[0, -2.9, 0]}>
    {buildings.map((building, index) => <group key={index} position={[building.x, building.height / 2, building.z]}>
      <mesh>
        <boxGeometry args={[building.width, building.height, .75]} />
        <meshStandardMaterial color={building.violet ? "#190737" : "#03151d"} emissive={building.violet ? "#4d08a8" : "#006478"} emissiveIntensity={.95} metalness={.88} roughness={.28} />
      </mesh>
      <mesh position={[0, 0, .381]}>
        <planeGeometry args={[building.width * .7, building.height * .72]} />
        <meshBasicMaterial color={building.violet ? "#c27cff" : "#35eeff"} transparent opacity={.25} />
      </mesh>
    </group>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.04, -10]}>
      <planeGeometry args={[35, 35]} /><meshStandardMaterial color="#02080d" metalness={.85} roughness={.32} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -9]}>
      <planeGeometry args={[3.1, 35]} /><meshBasicMaterial color="#071c26" transparent opacity={.8} />
    </mesh>
  </group>;
}

function Traffic() {
  const lights = useRef<THREE.Group>(null);
  useFrame((state) => {
    lights.current?.children.forEach((light, index) => {
      light.position.z = -3 - ((state.clock.elapsedTime * (2.8 + index % 3) + index * 3.6) % 25);
    });
  });
  return <group ref={lights} position={[0, -2.77, 0]}>
    {Array.from({ length: 14 }, (_, index) => <mesh key={index} position={[(index % 2 ? -.82 : .82), 0, -3 - index * 1.8]}>
      <boxGeometry args={[.075, .035, .75]} /><meshBasicMaterial color={index % 3 ? "#00d9ff" : "#b258ff"} />
    </mesh>)}
  </group>;
}

function Rain() {
  const rain = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(2600 * 3);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.random() - .5) * 30;
      values[index + 1] = Math.random() * 15 - 3;
      values[index + 2] = -Math.random() * 33;
    }
    return values;
  }, []);
  useFrame((state) => { if (rain.current) rain.current.position.y = -((state.clock.elapsedTime * .8) % 1.5); });
  return <points ref={rain}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#95efff" size={.025} transparent opacity={.78} sizeAttenuation /></points>;
}

function CameraDrift() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * .7, .025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.25 + pointer.y * .28, .025);
    camera.lookAt(0, -.25, -10);
  });
  return null;
}

function World() {
  return <>
    <ambientLight intensity={.23} />
    <hemisphereLight color="#4beaff" groundColor="#030307" intensity={.45} />
    <pointLight color="#00d9ff" intensity={20} position={[0, 3, 3]} distance={15} />
    <pointLight color="#7c3aed" intensity={17} position={[-7, 2, -5]} distance={16} />
    <pointLight color="#ffd700" intensity={4} position={[5, 1, -10]} distance={8} />
    <Rain /><Traffic /><CyberCity /><CameraDrift />
  </>;
}

export default function CyberScene() {
  return <div className="scene" aria-hidden="true"><Canvas camera={{ position: [0, 1.25, 10], fov: 56 }} dpr={[1, 1.5]}>
    <color attach="background" args={["#02050a"]} /><fog attach="fog" args={["#02050a", 7, 27]} /><World />
  </Canvas></div>;
}
