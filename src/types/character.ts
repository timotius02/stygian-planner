export type ElementType = 'pyro' | 'hydro' | 'electro' | 'cryo' | 'dendro' | 'anemo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'catalyst' | 'bow';

export interface Character {
  id: string;
  name: string;
  element: ElementType;
  weaponType: WeaponType;
  image: string;
  rarity: 4 | 5;
}
