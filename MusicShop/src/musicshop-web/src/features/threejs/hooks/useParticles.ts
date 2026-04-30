import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function useParticles(count: number) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions, offsets, and colors
  const { positions, offsets, colors } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const o = new Float32Array(count);
    const c = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Positions
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Offsets
      o[i] = Math.random() * Math.PI * 2;

      // Random Colors (Vibrant palette)
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return { positions: p, offsets: o, colors: c };
  }, [count]);

  return { pointsRef, positions, offsets, colors };
}
