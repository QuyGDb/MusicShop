import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls, Environment, SpotLight, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useControls, button } from 'leva';
import { useMusicHeroScene } from '../hooks/useMusicHeroScene';
import { Particles } from './Particles';
import { HeroText } from './HeroText';
import { Model } from './Model';

export function MusicHeroScene() {
  const { particleCount, fontUrl, heroText, models } = useMusicHeroScene();
  const cameraRef = useRef<any>(null);

  // Leva controls for Black Cat
  const catConfig = useControls('Black Cat', {
    position: { value: [-3.6, 6.7, -14.7], step: 0.1 },
    scale: { value: 4.3, min: 0.1, max: 10 },
    rotation: { value: [0, 3.2, 0], step: 0.1 }
  });

  // Leva controls for Vinyl Player
  const vinylConfig = useControls('Vinyl Player', {
    position: { value: [3.5, -5.2, -12.9], step: 0.1 },
    scale: { value: 15.8, min: 0.1, max: 30 },
    rotation: { value: [0, 0, 0], step: 0.1 }
  });

  // Leva controls for Room
  const roomConfig = useControls('Room', {
    position: { value: [0, -5, 0], step: 0.1 },
    scale: { value: 0.3, min: 0.01, max: 20 },
    rotation: { value: [0, 0, 0], step: 0.1 }
  });

  // Leva controls for Text
  const textConfig = useControls('Hero Text', {
    position: { value: [0.6, 2.1, -15.0], step: 0.1 },
    scale: { value: 1.1, min: 0.1, max: 10 },
    rotation: { value: [0, -3.2, 0], step: 0.1 }
  });

  // Leva controls for Scene
  const sceneConfig = useControls('Scene Environment', {
    ambientIntensity: { value: 0.84, min: 0, max: 2 },
    bloomIntensity: { value: 0.80, min: 0, max: 5 },
    background: '#09090b'
  });

  // Leva controls for Particles
  const particlesConfig = useControls('Particles', {
    count: { value: 2000, min: 100, max: 10000, step: 100 },
    size: { value: 0.4, min: 0.01, max: 2, step: 0.01 },
    color: '#f97316',
    opacity: { value: 0.6, min: 0, max: 1, step: 0.1 }
  });

  // Leva controls for Sky
  const skyConfig = useControls('Sky & Atmosphere', {
    sunPosition: { value: [0, -1, 0] },
    turbidity: { value: 0.1, min: 0, max: 10 },
    rayleigh: { value: 0.1, min: 0, max: 10 },
    mieCoefficient: { value: 0.005, min: 0, max: 0.1 },
    mieDirectionalG: { value: 0.7, min: 0, max: 1 }
  });

  // Leva controls for SpotLight
  const spotConfig = useControls('SpotLight', {
    position: { value: [4.8, 50.8, -9.2], step: 0.1 },
    intensity: { value: 0.9, min: 0, max: 10 },
    distance: { value: 4220, min: 0, max: 10000 },
    angle: { value: 1000, min: 0, max: 1000 },
    penumbra: { value: 1.0, min: 0, max: 1 },
    color: '#8a603e'
  });

  // Camera & Controls settings
  const { cameraPosition, controlsTarget, autoRotate, rotationSpeed } = useControls('Camera', {
    cameraPosition: { value: [-4.5, 9.6, -63.3], step: 0.1 },
    controlsTarget: { value: [0, 2, 0], step: 0.1 },
    autoRotate: false,
    rotationSpeed: { value: 1.0, min: 0.1, max: 10, step: 0.1 },
    'Log Camera State': button(() => {
      if (cameraRef.current) {
        const pos = cameraRef.current.position;
        const target = controlsTarget;
        console.log('--- CAMERA STATE SAVED ---');
        console.log(`cameraPosition: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`);
        console.log(`controlsTarget: [${target[0]}, ${target[1]}, ${target[2]}]`);
        console.log('---------------------------');
        alert('Camera state logged to Console (F12)!');
      }
    }),
  });

  return (
    <div style={{ width: '100%', height: '100vh', background: sceneConfig.background }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={cameraPosition}
          fov={45}
        />
        <Sky
          distance={450000}
          sunPosition={skyConfig.sunPosition}
          turbidity={skyConfig.turbidity}
          rayleigh={skyConfig.rayleigh}
          mieCoefficient={skyConfig.mieCoefficient}
          mieDirectionalG={skyConfig.mieDirectionalG}
        />

        <ambientLight intensity={sceneConfig.ambientIntensity} />
        <hemisphereLight intensity={0.5} color="white" groundColor="black" />
        <Environment preset="city" />

        <SpotLight
          position={spotConfig.position}
          angle={spotConfig.angle}
          penumbra={spotConfig.penumbra}
          intensity={spotConfig.intensity}
          distance={spotConfig.distance}
          color={spotConfig.color}
          castShadow
        />

        <OrbitControls
          makeDefault
          target={new THREE.Vector3(...controlsTarget)}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={200}
          autoRotate={autoRotate}
          autoRotateSpeed={rotationSpeed}
        />

        <Particles 
          count={particlesConfig.count} 
          size={particlesConfig.size}
          color={particlesConfig.color}
          opacity={particlesConfig.opacity}
        />
        
        <HeroText
          fontUrl={fontUrl}
          text={heroText}
          position={textConfig.position}
          rotation={textConfig.rotation}
          scale={textConfig.scale}
        />

        <Model
          url={models.room}
          scale={roomConfig.scale}
          rotation={roomConfig.rotation}
          position={roomConfig.position}
        />

        <Model
          url={models.blackCat}
          scale={catConfig.scale}
          rotation={catConfig.rotation}
          position={catConfig.position}
        />

        <Model
          url={models.vinylPlayer}
          scale={vinylConfig.scale}
          rotation={vinylConfig.rotation}
          position={vinylConfig.position}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={sceneConfig.bloomIntensity}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
