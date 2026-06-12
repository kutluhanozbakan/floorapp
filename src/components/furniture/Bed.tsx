import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting model: local x,z ∈ [-0.5, 0.5], y ∈ [0, 1].
// Headboard sits at -Z (back). Scale e.g. [1.6, 0.6, 2.0].
export default function Bed() {
  const frame = "#7f5539";
  const sheet = "#eae4d8";
  const duvet = "#b7c2bb";
  const pillow = "#fbfaf6";

  return (
    <group>
      {/* Frame / base */}
      <RoundedBox args={[1, 0.32, 1]} radius={0.03} smoothness={3} position={[0, 0.22, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={frame} roughness={0.7} />
      </RoundedBox>

      {/* Mattress */}
      <RoundedBox args={[0.94, 0.16, 0.92]} radius={0.05} smoothness={3} position={[0, 0.44, 0.03]} castShadow receiveShadow>
        <meshStandardMaterial color={sheet} roughness={0.9} />
      </RoundedBox>

      {/* Duvet (covers lower ~2/3) */}
      <RoundedBox args={[0.92, 0.1, 0.6]} radius={0.05} smoothness={3} position={[0, 0.53, 0.18]} castShadow receiveShadow>
        <meshStandardMaterial color={duvet} roughness={0.95} />
      </RoundedBox>

      {/* Pillows */}
      <RoundedBox args={[0.4, 0.12, 0.22]} radius={0.06} smoothness={4} position={[-0.22, 0.55, -0.3]} castShadow receiveShadow>
        <meshStandardMaterial color={pillow} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.12, 0.22]} radius={0.06} smoothness={4} position={[0.22, 0.55, -0.3]} castShadow receiveShadow>
        <meshStandardMaterial color={pillow} roughness={0.95} />
      </RoundedBox>

      {/* Headboard */}
      <RoundedBox args={[1, 0.5, 0.08]} radius={0.04} smoothness={3} position={[0, 0.5, -0.46]} castShadow receiveShadow>
        <meshStandardMaterial color={frame} roughness={0.7} />
      </RoundedBox>
    </group>
  );
}
