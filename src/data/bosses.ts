import type { Boss } from '@/types/boss';

export const BOSSES: Boss[] = [
  {
    id: 'tenebrous-papilla',
    name: 'Tenebrous Papilla',
    subtitle: 'Cunning Speed',
    level: 100,
    iconUrl: '/bosses/tenebrous-papilla.png',
    battleTime: 119,
    recommendedDamageTypes: [
      { type: 'special', label: 'High-frequency Elemental DMG' },
      { type: 'special', label: 'Nightsoul-aligned DMG' },
    ],
    discouragedDamageTypes: [],
    mechanics: [
      {
        title: 'Cunning Speed',
        description: 'The boss moves at high speed, requiring quick reactions and precise timing.',
      },
      {
        title: 'Shadow Phase',
        description: 'Boss enters shadow phase at 50% HP, becoming temporarily invulnerable.',
      },
    ],
    tips: [
      'Use characters with Nightsoul-aligned damage for maximum effectiveness',
      'High-frequency elemental damage is highly recommended',
      'Time your bursts carefully during the shadow phase',
    ],
  },
  {
    id: 'tent-tortoise',
    name: 'Battle-Hardened Tent Tortoise',
    subtitle: 'Electro Surge',
    level: 100,
    iconUrl: '/bosses/tent-tortoise.png',
    battleTime: 120,
    recommendedDamageTypes: [
      { type: 'special', label: 'Low-frequency DMG' },
    ],
    discouragedDamageTypes: [
      { type: 'special', label: 'High-frequency DMG' },
    ],
    mechanics: [
      {
        title: 'Electro Surge',
        description: 'Periodically releases electro shockwaves that deal area damage.',
      },
      {
        title: 'Shell Defense',
        description: 'Retreats into shell at low HP, gaining significant damage reduction.',
      },
    ],
    tips: [
      'Avoid high-frequency damage dealers as they are less effective',
      'Use heavy, slow-hitting attacks to break through the shell',
      'Bring electro resistance or shielders to survive the surges',
    ],
  },
  {
    id: 'pipilan-idol',
    name: 'Battle-Hardened Pipilpan Idol',
    subtitle: 'Flickering Mirage',
    level: 100,
    iconUrl: '/bosses/pipilan-idol.png',
    battleTime: 117,
    recommendedDamageTypes: [
      { type: 'reaction', label: 'Reactions' },
      { type: 'special', label: 'Shields' },
    ],
    discouragedDamageTypes: [],
    mechanics: [
      {
        title: 'Flickering Mirage',
        description: 'Creates illusory copies of itself that must be distinguished from the real boss.',
      },
      {
        title: 'Dance Sequence',
        description: 'Performs a ritual dance that buffs its attack and defense.',
      },
    ],
    tips: [
      'Elemental reactions are key to breaking through the mirage',
      'Shield characters help sustain through the heavy attacks',
      'Focus on the real boss when the mirage appears',
    ],
  },
];
