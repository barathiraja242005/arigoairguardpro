import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const Device3D = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main device body - scaled to represent actual dimensions */}
      {/* Height: 180mm, Width: 80mm, Depth: 60mm */}
      <RoundedBox args={[0.8, 1.8, 0.6]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#4FC3F7"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* Top section - filter indicator */}
      <RoundedBox args={[0.7, 0.3, 0.55]} position={[0, 0.8, 0]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#00BCD4"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Bottom section - intake grille */}
      <RoundedBox args={[0.75, 0.4, 0.58]} position={[0, -0.75, 0]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#0097A7"
          metalness={0.5}
          roughness={0.4}
        />
      </RoundedBox>

      {/* LED indicator light */}
      <mesh position={[0, 0.95, 0.31]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#4CAF50"
          emissive="#4CAF50"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Air vents - side details */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <group key={i}>
          <mesh position={[0.41, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
            <meshStandardMaterial color="#006064" metalness={0.9} />
          </mesh>
          <mesh position={[-0.41, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
            <meshStandardMaterial color="#006064" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Floating particles effect */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle + Date.now() * 0.001) * radius,
              Math.sin(Date.now() * 0.002 + i) * 0.5,
              Math.sin(angle + Date.now() * 0.001) * radius,
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color="#4FC3F7"
              transparent
              opacity={0.6}
              emissive="#4FC3F7"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Device3D;
