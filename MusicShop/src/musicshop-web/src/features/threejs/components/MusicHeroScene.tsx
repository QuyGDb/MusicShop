import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls, Environment, ContactShadows, SpotLight } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useControls } from 'leva';
import { useMusicHeroScene } from '../hooks/useMusicHeroScene';
import { Particles } from './Particles';
import { HeroText } from './HeroText';
import { Model } from './Model';


export function MusicHeroScene() {
  const { particleCount, fontUrl, heroText, models } = useMusicHeroScene();

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

  return (
    <div style={{ width: '100%', height: '100%', background: sceneConfig.background }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: false, stencil: false, depth: true }}>
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
          enableDamping
          dampingFactor={0.05}
          minDistance={15}
          maxDistance={100}
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

        {/* White Room Model controlled by Leva */}
        <Model
          url={models.room}
          scale={roomConfig.scale}
          rotation={roomConfig.rotation}
          position={roomConfig.position}
        />

        {/* Black Cat Model controlled by Leva */}
        <Model
          url={models.blackCat}
          scale={catConfig.scale}
          rotation={catConfig.rotation}
          position={catConfig.position}
        />

        {/* Vinyl Player Model controlled by Leva */}
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
