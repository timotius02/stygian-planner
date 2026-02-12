import type { Boss } from '@/types/boss';

// Stygian Onslaught v6.4 bosses
// Version 6.4 - January 13, 2026 to February 12, 2026
export const BOSSES: Boss[] = [
  {
    id: 'hexadecatonic-mandragora',
    name: 'Battle-Hardened Hexadecatonic Mandragora: Stormvine',
    subtitle: 'Agglomerated State',
    level: 105,
    iconUrl: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_MandragoraElite.png',
    battleTime: 120,
    recommendedDamageTypes: [
      { type: 'elemental', label: 'Pyro DMG' },
      { type: 'elemental', label: 'Electro DMG' },
      { type: 'elemental', label: 'Anemo DMG (in Split State)' },
      { type: 'special', label: 'Crowd Control' },
    ],
    discouragedDamageTypes: [],
    mechanics: [
      {
        title: 'Powerful Agglomerated State',
        description: 'When battle begins, enters Agglomerated State with dramatically increased All RES. Agglomeration Energy is constantly consumed. Dealing Pyro or Electro DMG drains this energy more quickly. When depleted, unleashes Sporebloom and switches to Split State.',
      },
      {
        title: 'Split State',
        description: 'Splits into a large number of spores. When spores take damage, a percentage of that damage is also dealt to the boss. After remaining in Split State for a period, returns to Agglomerated State.',
      },
      {
        title: 'Brittle Agglomerated State',
        description: 'If spores on the field fall below a certain number, enters Brittle Agglomerated State where All RES is greatly reduced and combat abilities are diminished. If all spores are defeated, exits Split State early and enters Brittle Agglomerated State.',
      },
      {
        title: 'Hollow Structure',
        description: 'When in Split State or Brittle Agglomerated State, Anemo RES is greatly reduced.',
      },
    ],
    tips: [
      'Use Pyro or Electro characters to drain Agglomeration Energy quickly',
      'Focus on defeating spores in Split State to trigger Brittle Agglomerated State',
      'Anemo characters are effective during Split State due to reduced Anemo RES',
      'Crowd Control abilities help manage spores efficiently',
      'Boss returns to Agglomerated State if Split State lasts too long - burst during Brittle phase',
    ],
  },
  {
    id: 'knuckle-duckle',
    name: 'Knuckle Duckle: Armored Arsenal',
    subtitle: 'Heavy Duckstruction Mode',
    level: 105,
    iconUrl: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_Gastrobot01.png',
    battleTime: 120,
    recommendedDamageTypes: [
      { type: 'reaction', label: 'Electro-Charged' },
      { type: 'reaction', label: 'Lunar-Charged' },
      { type: 'special', label: 'Multi-hit Damage' },
    ],
    discouragedDamageTypes: [],
    mechanics: [
      {
        title: 'Heavy Duckstruction Mode',
        description: 'When battle begins, aggression increases. Generates a Ward that increases All RES, and summons floating Stamping Devices to harass you.',
      },
      {
        title: 'Low-Resistance Stamping Devices',
        description: 'Deal Electro-Charged or Lunar-Charged DMG repeatedly, or simply deal enough damage to destroy the stamping devices to disrupt them. Disrupted devices lose control and crash into the boss, dealing damage to its Ward and greatly reducing Electro RES for a certain time.',
      },
      {
        title: 'Fast Frequency-Hopping System',
        description: 'Stamping devices become more resilient. Deal more instances of Electro-Charged or Lunar-Charged DMG, or more damage to these devices to disrupt them. Electro-Charged or Lunar-Charged DMG dealt to stamping devices is more effective. When devices lose control and crash into the boss, damage dealt increases based on total damage taken by the devices.',
      },
    ],
    tips: [
      'Use Electro-Charged or Lunar-Charged reactions for maximum effectiveness',
      'Multi-hit attacks work well against stamping devices',
      'Destroying devices reduces boss Electro RES - coordinate bursts after device destruction',
      'The more damage devices take before crashing, the more damage they deal to the boss',
      'Focus on disrupting devices to break the Ward and expose the boss',
    ],
  },
  {
    id: 'secret-source-automaton',
    name: 'Secret Source Automaton: Overseer Device - Obliterator Panoply',
    subtitle: 'Sweeper Mode',
    level: 100,
    iconUrl: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_DragonCollar.png',
    battleTime: 120,
    recommendedDamageTypes: [
      { type: 'elemental', label: 'Cryo DMG' },
      { type: 'special', label: 'Nightsoul Characters' },
    ],
    discouragedDamageTypes: [],
    mechanics: [
      {
        title: 'Preemptive Sweeper Mode',
        description: 'Immediately enters Sweeper Mode when combat starts. All Elemental and Physical RES is greatly increased. Generates Flow Momentum while performing attacks. Higher Flow Momentum means faster rotation and more DMG dealt.',
      },
      {
        title: 'Flow Momentum Loss',
        description: 'Will lose Flow Momentum after taking Cryo DMG. Below a certain Flow Momentum value, it will stop rotating and attacking, and All Elemental and Physical RES will be greatly decreased, with Cryo RES decreasing still more. Each time it enters Sweeper Mode, it will produce additional Elemental Orbs the first time its rotating attacks are stopped.',
      },
      {
        title: 'Forced Counterstrike Mode',
        description: 'If an active character enters and maintains the Nightsoul\'s Blessing state for a time, the opponent will enter Forced Counterstrike Mode and switch to attacking with powerful tracking rays. At this time, All Elemental and Physical RES will be decreased. After taking a certain number of Cryo DMG instances, it will cease attacking altogether and All Elemental and Physical RES will be further decreased.',
      },
      {
        title: 'Damage-Resistant Structure',
        description: 'Has All RES further increased, and loses less Flow Momentum when struck by Cryo DMG. Will also lose less RES when in Forced Counterstrike Mode.',
      },
    ],
    tips: [
      'Cryo characters are essential for reducing Flow Momentum',
      'Nightsoul characters can trigger Forced Counterstrike Mode for RES reduction',
      'Stop the rotating attacks to generate Elemental Orbs (once per Sweeper Mode)',
      'Boss has high initial RES - focus on mechanics rather than raw damage at start',
      'In Forced Counterstrike Mode, keep applying Cryo to make it cease attacking completely',
      'Burst during RES reduction windows after stopping rotation or during Counterstrike Mode',
    ],
  },
];
