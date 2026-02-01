export interface DamageType {
  type: 'elemental' | 'physical' | 'reaction' | 'special';
  label: string;
  icon?: string;
}

export interface BossMechanic {
  title: string;
  description: string;
  iconUrl?: string;
}

export interface Boss {
  id: string;
  name: string;
  subtitle: string;
  level: number;
  iconUrl: string;
  battleTime: number;
  recommendedDamageTypes: DamageType[];
  discouragedDamageTypes: DamageType[];
  mechanics: BossMechanic[];
  tips: string[];
}
