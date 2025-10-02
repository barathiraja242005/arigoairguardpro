import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const Device3D = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.08;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main device body - premium white/silver finish */}
      <RoundedBox args={[0.8, 1.8, 0.6]} radius={0.12} smoothness={6}>
        <meshPhysicalMaterial
          color="#f8f9fa"
          metalness={0.3}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
        />
      </RoundedBox>

      {/* Top cap - darker accent */}
      <RoundedBox args={[0.82, 0.15, 0.62]} position={[0, 0.925, 0]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#2c3e50"
          metalness={0.8}
          roughness={0.3}
          clearcoat={0.8}
        />
      </RoundedBox>

      {/* Bottom base */}
      <RoundedBox args={[0.85, 0.12, 0.65]} position={[0, -0.96, 0]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#34495e"
          metalness={0.6}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Display screen - OLED effect */}
      <RoundedBox args={[0.5, 0.3, 0.02]} position={[0, 0.4, 0.31]} radius={0.02} smoothness={4}>
        <meshPhysicalMaterial
          color="#0a0e27"
          metalness={0.9}
          roughness={0.1}
          emissive="#1e3a8a"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Display content - AQI reading */}
      <Text
        position={[0, 0.45, 0.32]}
        fontSize={0.08}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        AQI: 42
      </Text>
      <Text
        position={[0, 0.35, 0.32]}
        fontSize={0.05}
        color="#60a5fa"
        anchorX="center"
        anchorY="middle"
      >
        GOOD
      </Text>

      {/* Power LED indicator */}
      <mesh position={[0, 0.85, 0.31]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Status LED indicator */}
      <mesh position={[0.15, 0.85, 0.31]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Touch buttons */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.31]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshPhysicalMaterial
            color="#64748b"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Air intake grille - hexagonal pattern */}
      <group position={[0, -0.4, 0.31]}>
        {[-0.2, -0.1, 0, 0.1, 0.2].map((y, i) =>
          [-0.15, -0.05, 0.05, 0.15].map((x, j) => (
            <mesh key={`${i}-${j}`} position={[x, y, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.02, 6]} />
              <meshPhysicalMaterial
                color="#475569"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Side ventilation slots */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((y, i) => (
        <group key={i}>
          {/* Left side */}
          <RoundedBox args={[0.02, 0.08, 0.4]} position={[-0.405, y, 0]} radius={0.01}>
            <meshPhysicalMaterial
              color="#334155"
              metalness={0.8}
              roughness={0.2}
            />
          </RoundedBox>
          {/* Right side */}
          <RoundedBox args={[0.02, 0.08, 0.4]} position={[0.405, y, 0]} radius={0.01}>
            <meshPhysicalMaterial
              color="#334155"
              metalness={0.8}
              roughness={0.2}
            />
          </RoundedBox>
        </group>
      ))}

      {/* Air outlet vents - top */}
      <group position={[0, 0.8, 0]}>
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
            <meshPhysicalMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Brand logo area */}
      <RoundedBox args={[0.3, 0.08, 0.01]} position={[0, -0.6, 0.31]} radius={0.01}>
        <meshPhysicalMaterial
          color="#1e40af"
          metalness={0.7}
          roughness={0.3}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </RoundedBox>
      <Text
        position={[0, -0.6, 0.32]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        AriGo
      </Text>

      {/* Air quality sensor */}
      <mesh position={[0.3, 0.5, 0.31]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshPhysicalMaterial
          color="#1f2937"
          metalness={0.9}
          roughness={0.1}
          emissive="#6366f1"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Floating air particles - enhanced effect */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 1.8 + Math.sin(i * 0.5) * 0.3;
        const speed = 0.001 + (i % 3) * 0.0003;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle + Date.now() * speed) * radius,
              Math.sin(Date.now() * (speed * 2) + i) * 0.8,
              Math.sin(angle + Date.now() * speed) * radius,
            ]}
          >
            <sphereGeometry args={[0.015 + (i % 3) * 0.01, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#4ade80" : "#a78bfa"}
              transparent
              opacity={0.7}
              emissive={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#4ade80" : "#a78bfa"}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Light ring effect at bottom */}
      <mesh position={[0, -0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.01, 16, 50]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default Device3D;
