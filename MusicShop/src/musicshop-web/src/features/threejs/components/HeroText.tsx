import React, { useRef } from 'react';
import { Text3D, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHeroText } from '../hooks/useHeroText';

interface HeroTextProps {
  fontUrl: string;
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function HeroText({ fontUrl, text, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: HeroTextProps) {
  useHeroText();
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Hiệu ứng nhấp nháy (breathing glow) cho chữ
  useFrame((state) => {
    if (materialRef.current) {
      // Dao động intensity từ 5 đến 15 theo thời gian
      const intensity = 10 + Math.sin(state.clock.elapsedTime * 2) * 5;
      materialRef.current.emissiveIntensity = intensity;
    }
  });

  return (
    <Center position={position} rotation={rotation} scale={scale}>
      <Text3D
        font={fontUrl}
        size={1.2}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial
          ref={materialRef}
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={10}
          toneMapped={false}
        />
      </Text3D>
    </Center>
  );
}
