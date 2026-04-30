import { useMemo } from 'react';
import blackCatModel from '@/assets/models/black_cat.glb';
import roomModel from '@/assets/models/empty_white_room_final.glb';
import vinylPlayerModel from '@/assets/models/stylized_vinyl_player.glb';

export interface UseMusicHeroSceneReturn {
  particleCount: number;
  fontUrl: string;
  heroText: string;
  models: {
    blackCat: string;
    room: string;
    vinylPlayer: string;
  };
}

export function useMusicHeroScene(): UseMusicHeroSceneReturn {
  const particleCount = 2000;
  const fontUrl = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json";
  const heroText = "CAT MUSIC SHOP";

  const models = useMemo(() => ({
    blackCat: blackCatModel,
    room: roomModel,
    vinylPlayer: vinylPlayerModel
  }), []);

  return {
    particleCount,
    fontUrl,
    heroText,
    models
  };
}
