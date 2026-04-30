import { useGLTF } from '@react-three/drei';

export function useModel(url: string) {
  // useGLTF will load the model and cache it
  const { scene } = useGLTF(url);
  
  // Clone the scene to allow multiple instances of the same model if needed
  // scene.clone() is safer if we want to modify properties per instance
  return { scene };
}
