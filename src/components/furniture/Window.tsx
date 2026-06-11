import React from "react";

export default function Window() {
  return (
    <group>
      {/* Window Frame Outer */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1.05]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      
      {/* Glass / Inner empty space visual */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 1.1]} />
        <meshPhysicalMaterial 
          color="#bae6fd" 
          transparent={true} 
          opacity={0.5} 
          roughness={0.1} 
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      
      {/* Middle Frame Line */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 1, 1.06]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}
