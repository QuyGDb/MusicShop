import React from 'react';
import { useModel } from '../hooks/useModel';

interface ModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

export function Model({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ModelProps) {
  const { scene } = useModel(url);

  // Clone the scene so we don't interfere with other instances of the same model
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      scale={scale} 
      rotation={rotation}
    />
  );
}
