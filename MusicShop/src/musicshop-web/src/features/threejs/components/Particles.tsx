import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useParticles } from '../hooks/useParticles';

import { useTexture } from '@react-three/drei';
import noteImage from '../../../assets/textures/note.png';

interface ParticlesProps {
  count: number;
  size: number;
  color: string;
  opacity: number;
}

export function Particles({ count, size, color, opacity }: ParticlesProps) {
  const { pointsRef, positions, offsets, colors } = useParticles(count);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Load the actual PNG texture
  const noteTexture = useTexture(noteImage);

  // Update time for the shader
  useFrame((state) => {
    if (materialRef.current && materialRef.current.userData.shader) {
      materialRef.current.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={size}
        color="white"
        transparent
        opacity={opacity}
        sizeAttenuation={true}
        map={noteTexture}
        alphaTest={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 };

          shader.vertexShader = `
            uniform float uTime;
            attribute float aOffset;
            attribute vec3 aColor;
            varying float vOpacity;
            varying vec3 vColor;
            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `
              #include <begin_vertex>
              vOpacity = pow(sin(uTime * 1.5 + aOffset) * 0.5 + 0.5, 5.0);
              vColor = aColor;
            `
          );

          shader.fragmentShader = `
            varying float vOpacity;
            varying vec3 vColor;
            ${shader.fragmentShader}
          `.replace(
            '#include <color_fragment>',
            `
              #include <color_fragment>
              diffuseColor.rgb *= vColor * 4.0; 
              diffuseColor.a *= vOpacity;
            `
          );

          materialRef.current!.userData.shader = shader;
        }}
      />
    </points>
  );
}
