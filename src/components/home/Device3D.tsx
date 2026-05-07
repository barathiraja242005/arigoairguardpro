import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

export type DevicePart = "display" | "filter" | "outlet" | "sensor" | "power" | "battery";

interface Device3DProps {
  selectedPart: DevicePart | null;
  onSelectPart: (part: DevicePart | null) => void;
}

/** Subtle hover/select animation: scales the group toward target. */
function useSpringScale(ref: React.RefObject<THREE.Group>, target: number) {
  useFrame(() => {
    if (!ref.current) return;
    const s = ref.current.scale.x;
    const next = s + (target - s) * 0.18;
    ref.current.scale.set(next, next, next);
  });
}

interface PartProps {
  partKey: DevicePart;
  selectedPart: DevicePart | null;
  onSelectPart: (part: DevicePart | null) => void;
  children: React.ReactNode;
  position?: [number, number, number];
}

const Part = ({ partKey, selectedPart, onSelectPart, children, position }: PartProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === partKey;
  useSpringScale(groupRef, isSelected ? 1.18 : 1);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectPart(isSelected ? null : partKey);
  };

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handleOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {children}
    </group>
  );
};

const Device3D = ({ selectedPart, onSelectPart }: Device3DProps) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Pause spin when a part is selected so users can read the label
    if (selectedPart) {
      meshRef.current.rotation.y += (Math.PI * 0.05 - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * 0.08;
    } else {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.06;
    }
  });

  // Click on empty area deselects
  const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.intersections.length === 0) onSelectPart(null);
  };

  return (
    <group ref={meshRef} onPointerMissed={() => onSelectPart(null)}>
      {/* ───────── Main capsule body — handheld portable form ───────── */}
      <RoundedBox args={[0.65, 1.55, 0.42]} radius={0.22} smoothness={6}>
        <meshPhysicalMaterial
          color="#f5f6f8"
          metalness={0.25}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.06}
          reflectivity={0.85}
        />
      </RoundedBox>

      {/* Subtle inner glow shell to suggest hollow, eco product feel */}
      <RoundedBox args={[0.66, 1.56, 0.43]} radius={0.22} smoothness={4}>
        <meshPhysicalMaterial
          color="#22c55e"
          transparent
          opacity={0.04}
          metalness={0.1}
          roughness={1}
        />
      </RoundedBox>

      {/* ───────── Lanyard loop on top — portability cue ───────── */}
      <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.013, 16, 32]} />
        <meshPhysicalMaterial color="#374151" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ───────── Top cap — outlet (clickable) ───────── */}
      <Part partKey="outlet" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0, 0.78, 0]}>
        <RoundedBox args={[0.62, 0.12, 0.4]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#1f2937"
            metalness={0.85}
            roughness={0.25}
            emissive={selectedPart === "outlet" ? "#22c55e" : "#000000"}
            emissiveIntensity={selectedPart === "outlet" ? 0.5 : 0}
          />
        </RoundedBox>
        {/* Outlet vent slots — face upward */}
        {[-0.18, -0.06, 0.06, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.061, 0]}>
            <boxGeometry args={[0.04, 0.012, 0.22]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
        {/* Outlet directional arrows */}
        {[-0.12, 0, 0.12].map((x) => (
          <mesh key={`arrow-${x}`} position={[x, 0.07, 0.16]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.025, 0.002, 0.025]} />
            <meshStandardMaterial color={selectedPart === "outlet" ? "#22c55e" : "#475569"} emissive={selectedPart === "outlet" ? "#22c55e" : "#000"} emissiveIntensity={selectedPart === "outlet" ? 1.5 : 0} />
          </mesh>
        ))}
      </Part>

      {/* ───────── Bottom cap — INTAKE / 3-stage filter (clickable) ───────── */}
      <Part partKey="filter" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0, -0.78, 0]}>
        <RoundedBox args={[0.66, 0.14, 0.43]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color={selectedPart === "filter" ? "#1e3a8a" : "#1e293b"}
            metalness={0.7}
            roughness={0.35}
            emissive={selectedPart === "filter" ? "#22c55e" : "#000000"}
            emissiveIntensity={selectedPart === "filter" ? 0.5 : 0}
          />
        </RoundedBox>
        {/* Hex-grid intake holes — face downward */}
        {[-0.18, -0.09, 0, 0.09, 0.18].map((x) =>
          [-0.13, -0.04, 0.05, 0.14].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.071, z]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.012, 6]} />
              <meshPhysicalMaterial color="#0f172a" metalness={0.6} roughness={0.6} />
            </mesh>
          )),
        )}
        {/* Filter ring indicator — glows green when clean */}
        <mesh position={[0, -0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.005, 16, 64]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={selectedPart === "filter" ? 2 : 0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Part>

      {/* ───────── Back panel — BATTERY + USB-C (clickable) ───────── */}
      <Part partKey="battery" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0, 0, -0.215]}>
        {/* Back plate */}
        <RoundedBox args={[0.5, 1.1, 0.012]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color={selectedPart === "battery" ? "#1e3a8a" : "#1f2937"}
            metalness={0.8}
            roughness={0.3}
            emissive={selectedPart === "battery" ? "#22c55e" : "#000000"}
            emissiveIntensity={selectedPart === "battery" ? 0.45 : 0}
          />
        </RoundedBox>
        {/* Battery cell pattern — 4 segments showing charge */}
        {[0.28, 0.12, -0.04, -0.20].map((y, i) => (
          <RoundedBox key={y} args={[0.32, 0.10, 0.006]} position={[0, y, -0.008]} radius={0.018}>
            <meshStandardMaterial
              color={i < 3 ? "#22c55e" : "#475569"}
              emissive={i < 3 ? "#22c55e" : "#000"}
              emissiveIntensity={i < 3 ? (selectedPart === "battery" ? 1.5 : 0.7) : 0}
            />
          </RoundedBox>
        ))}
        {/* "8h" runtime label */}
        <Text
          position={[0, -0.38, -0.008]}
          fontSize={0.06}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
        >
          8h · 2600mAh
        </Text>
        {/* USB-C port — bottom of back panel */}
        <RoundedBox args={[0.13, 0.035, 0.02]} position={[0, -0.50, -0.012]} radius={0.012}>
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </RoundedBox>
        <Text
          position={[0, -0.55, -0.008]}
          fontSize={0.025}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          USB-C
        </Text>
      </Part>

      {/* ───────── OLED Display (clickable) ───────── */}
      <Part partKey="display" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0, 0.32, 0.215]}>
        <RoundedBox args={[0.42, 0.34, 0.015]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial
            color="#0a0e27"
            metalness={0.9}
            roughness={0.1}
            emissive={selectedPart === "display" ? "#22c55e" : "#0e7c4a"}
            emissiveIntensity={selectedPart === "display" ? 0.6 : 0.25}
          />
        </RoundedBox>
        {/* AQI big number */}
        <Text
          position={[0, 0.05, 0.012]}
          fontSize={0.11}
          color="#86efac"
          anchorX="center"
          anchorY="middle"
        >
          42
        </Text>
        <Text
          position={[0, -0.05, 0.012]}
          fontSize={0.04}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
        >
          AQI · GOOD
        </Text>
        <Text
          position={[0, -0.12, 0.012]}
          fontSize={0.025}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          PM2.5  12 μg/m³
        </Text>
      </Part>

      {/* ───────── Power button (clickable) ───────── */}
      <Part partKey="power" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0, -0.18, 0.215]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 32]} />
          <meshPhysicalMaterial
            color="#475569"
            metalness={0.85}
            roughness={0.2}
            emissive={selectedPart === "power" ? "#22c55e" : "#000000"}
            emissiveIntensity={selectedPart === "power" ? 0.6 : 0}
          />
        </mesh>
        {/* Power glyph ring */}
        <mesh position={[0, 0.009, 0]}>
          <torusGeometry args={[0.035, 0.005, 16, 32]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={selectedPart === "power" ? 2.5 : 1.2}
          />
        </mesh>
      </Part>

      {/* ───────── Sensor module (clickable) ───────── */}
      <Part partKey="sensor" selectedPart={selectedPart} onSelectPart={onSelectPart} position={[0.22, 0.55, 0.215]}>
        <mesh>
          <cylinderGeometry args={[0.038, 0.038, 0.018, 32]} />
          <meshPhysicalMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.1}
            emissive={selectedPart === "sensor" ? "#22c55e" : "#3b82f6"}
            emissiveIntensity={selectedPart === "sensor" ? 1.2 : 0.5}
          />
        </mesh>
        {/* Inner ring */}
        <mesh position={[0, 0.011, 0]}>
          <torusGeometry args={[0.022, 0.003, 16, 32]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1.5} />
        </mesh>
      </Part>

      {/* ───────── Side ventilation slats — non-interactive cosmetic ───────── */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((y) => (
        <group key={y}>
          <RoundedBox args={[0.014, 0.07, 0.3]} position={[-0.328, y, 0]} radius={0.005}>
            <meshPhysicalMaterial color="#475569" metalness={0.85} roughness={0.18} />
          </RoundedBox>
          <RoundedBox args={[0.014, 0.07, 0.3]} position={[0.328, y, 0]} radius={0.005}>
            <meshPhysicalMaterial color="#475569" metalness={0.85} roughness={0.18} />
          </RoundedBox>
        </group>
      ))}

      {/* ───────── Brand strip ───────── */}
      <RoundedBox args={[0.22, 0.06, 0.008]} position={[0, -0.45, 0.215]} radius={0.01}>
        <meshPhysicalMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      <Text
        position={[0, -0.45, 0.222]}
        fontSize={0.038}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
      >
        AriGo
      </Text>

      {/* ───────── Ambient base glow ring (decorative) ───────── */}
      <mesh position={[0, -0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.008, 16, 64]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.2}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Background-click receiver (invisible plane behind the device) */}
      <mesh position={[0, 0, -1]} onClick={handleBackgroundClick}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
};

export default Device3D;
