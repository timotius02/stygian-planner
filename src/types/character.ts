export type ElementType = 'pyro' | 'hydro' | 'electro' | 'cryo' | 'dendro' | 'anemo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'catalyst' | 'bow';

export interface Character {
  id: string;
  name: string;
  element: ElementType;
  weaponType: WeaponType;
  iconUrl: string;
  rarity: 4 | 5;
}

export interface OwnedCharacter extends Character {
  level: number;
  constellation: number;
  talents: {
    normalAttack: number;
    elementalSkill: number;
    elementalBurst: number;
  };
}
